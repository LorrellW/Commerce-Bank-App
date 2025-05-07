"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useUser } from "@/app/context/UserContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ChartCard } from "@/app/components/ChartCard";
import { theme } from "@/app/components/ChartTheme";
import { useQuote } from "@/app/components/useQuote";
import LockFilled from "@ant-design/icons/LockFilled";

/* ─── API types ─────────────────────────────────── */
interface AccountApi {
  accountID: number;
  accountType: string;
  balance: number;
  creationDate: string;
}
interface TxApi {
  tID: number;
  accountID: number;
  tDate: string;
  amount: number;
  description: string;
}

/* ─── Dashboard component ───────────────────────── */
export default function Dashboard() {
  const { user } = useUser();
  const [accounts, setAccounts]   = useState<AccountApi[]>([]);
  const [activeId, setActiveId]   = useState<number | null>(null);
  const [tx, setTx]               = useState<TxApi[]>([]);
  const [loading, setLoading]     = useState(true);

  /* fetch accounts + tx once */
  useEffect(() => {
    if (!user?.cID) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/customer", {
          headers: { "x-user-cid": user.cID },
        });
        setAccounts(data.accounts);
        setTx(data.transactions);
        if (data.accounts.length) setActiveId(data.accounts[0].accountID);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.cID]);

  /* derived helpers */
  const activeTx   = useMemo(() => tx.filter(t => t.accountID === activeId), [tx, activeId]);
  const totalCash  = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts]);
  const thisMonth  = new Date().toISOString().slice(0, 7);
  const monthTx    = tx.filter(t => t.tDate.startsWith(thisMonth));

  /* running‑balance series */
  const balanceSeries = useMemo(() => {
    let bal = accounts.find(a => a.accountID === activeId)?.balance ?? 0;
    return [...activeTx]
      .sort((a, b) => new Date(a.tDate).getTime() - new Date(b.tDate).getTime())
      .map(t => ({ date: t.tDate.slice(5, 10), bal: (bal += t.amount) }));
  }, [activeTx, accounts, activeId]);

  /* categories pie */
  const catKeywords = ["grocery","rent","fuel","salary","transfer"];
  const pieData = useMemo(() => {
    const m: Record<string, number> = {};
    catKeywords.forEach(c => (m[c] = 0));
    activeTx.forEach(t => {
      const k = catKeywords.find(c => t.description.toLowerCase().includes(c)) ?? "other";
      m[k] = (m[k] || 0) + Math.abs(t.amount);
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [activeTx]);

  /* bar chart: income vs spend */
  const barData = useMemo(() => {
    const map: Record<string, { income: number; spend: number }> = {};
    tx.forEach(t => {
      const ym = t.tDate.slice(0, 7);
      if (!map[ym]) map[ym] = { income: 0, spend: 0 };
      if (t.amount >= 0) map[ym].income +=  t.amount;
      else               map[ym].spend  += -t.amount;
    });
    return Object.entries(map).map(([month, { income, spend }]) => ({ month, income, spend }));
  }, [tx]);

  /* guards */
  if (!user)
    return (
      <div className="text-center h-[500px] pt-20">
        <p className="text-black text-2xl py-6 mb-4">Sign in to unlock Dashboard features</p>
        <LockFilled className="text-3xl text-black" />
      </div>
    );

  if (loading)
    return <p className="text-center text-black text-xl py-20">Loading dashboard…</p>;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* MAIN PANE */}
      <main className="flex-1 overflow-y-auto bg-gray-800 p-6 text-white">
        <h1 className="text-3xl font-light mb-8">
          Welcome back, {user.firstName ?? "Customer"}!
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Kpi title="Total balance" value={`$${totalCash.toLocaleString()}`} />
          <Kpi title="Accounts"      value={accounts.length} />
          <Kpi title="Tx this month" value={monthTx.length} />
          <Kpi
            title="Avg. spend / tx"
            value={
              monthTx.length
                ? `$${(monthTx.reduce((s,t)=>s+Math.abs(t.amount),0)/monthTx.length).toFixed(2)}`
                : "—"
            }
          />
        </div>

        {/* account cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {accounts.map(a => (
            <button
              key={a.accountID}
              onClick={() => setActiveId(a.accountID)}
              className={`rounded-xl p-4 shadow-lg text-left transition
                ${a.accountID===activeId ? "bg-cyan-700" : "bg-gray-900 hover:bg-gray-700"}`}
            >
              <h3 className="font-semibold text-lg">{a.accountType}</h3>
              <p className="text-lg mt-2">${a.balance.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">
                opened {new Date(a.creationDate).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* balance area */}
          <ChartCard title="Balance history">
            <AreaChart data={balanceSeries}>
              <defs>
                <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.series.balance} stopOpacity={0.4}/>
                  <stop offset="100%" stopColor={theme.series.balance} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke={theme.fg} fontSize={theme.fontSm}/>
              <YAxis stroke={theme.fg} fontSize={theme.fontSm}/>
              <CartesianGrid stroke={theme.grid} strokeDasharray="3 3"/>
              <Tooltip />
              <Area type="monotone" dataKey="bal" stroke={theme.series.balance} fill="url(#balFill)" strokeWidth={2}/>
            </AreaChart>
          </ChartCard>

          {/* spending categories */}
          <ChartCard title="Spending categories">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>

          {/* monthly income vs spend */}
          <ChartCard title="Income / Spend by month" wide height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid}/>
              <XAxis dataKey="month" stroke={theme.fg} fontSize={theme.fontSm}/>
              <YAxis stroke={theme.fg} fontSize={theme.fontSm}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="income" stackId="a" fill={theme.series.income}/>
              <Bar dataKey="spend"  stackId="a" fill={theme.series.spend}/>
            </BarChart>
          </ChartCard>
        </div>
      </main>

      {/* RIGHT SIDEBAR – live markets */}
<aside className="w-96 shrink-0 sticky top-0 bg-gray-900 text-white p-6 space-y-4">
  <h2 className="text-lg font-medium mb-2">Markets</h2>

  <TickerBox sym="AAPL" />
  <TickerBox sym="MSFT" />
  <TickerBox sym="TSLA" />

  {/* 👇 add this explanatory note */}
  <p className="mt-4 text-xs text-gray-400">
    Prices refreshed every 30&nbsp;seconds – powered by&nbsp;
    <a
      href="https://finnhub.io"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-gray-300"
    >
      Finnhub&nbsp;API
    </a>
    .
  </p>
</aside>
    </div>
  );
}

/* ─── helpers ───────────────────────────────────── */
function Kpi({ title, value }:{title:string,value:string|number}) {
  return (
    <div className="bg-gray-900 rounded px-4 py-6">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}

/* live price widget using useQuote hook */
function TickerBox({ sym }: { sym: string }) {
  const { data, error } = useQuote(sym);

  /* 1 – initial load */
  if (!data && !error)
    return <div className="h-16 bg-gray-700 rounded animate-pulse" />;

  /* 2 – network / API‑route error OR API returned an error note */
  if (error || data?.error)
    return (
      <div className="h-16 bg-red-900/60 rounded p-3 text-xs flex items-center">
        {sym}: {(error as Error)?.message ?? data?.error}
      </div>
    );

  /* 3 – ensure we have numeric values before calling toFixed */
  const price  = Number(data?.price);
  const change = Number(data?.change);

  if (!isFinite(price) || !isFinite(change))
    return (
      <div className="h-16 bg-red-900/60 rounded p-3 text-xs flex items-center">
        {sym}: no data
      </div>
    );

  /* 4 – render happy path */
  const up = change >= 0;
  return (
    <div className="h-16 bg-gray-700 rounded p-4 flex items-center justify-between">
      <span>{sym}</span>
      <span className={up ? "text-green-400" : "text-red-400"}>
        ${price.toFixed(2)} ({change.toFixed(2)}%)
      </span>
    </div>
  );
}
