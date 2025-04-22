// app/pages/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid, Legend,
} from "recharts";

interface AccountApi {
  accountID: number;
  accountType: string;
  balance: number;
  creationDate: string;
}

interface TxApi {
  tID: number;
  accountID: number;
  tDate: string;          // ISO
  amount: number;         // positive = credit, negative = debit
  description: string;
}

export default function Dashboard() {
  const { user } = useUser();

  const [accounts, setAccounts] = useState<AccountApi[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [tx, setTx]           = useState<TxApi[]>([]);
  const [loading, setLoading] = useState(true);

  /* ─────────── Fetch once (accounts + all transactions) ─────────── */
  useEffect(() => {
    if (!user?.cID) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/customer", {
          headers: { "x-user-cid": user.cID }
        });
        setAccounts(data.accounts);          // ← from route we built earlier
        setTx(data.transactions);
        if (data.accounts.length) setActiveId(data.accounts[0].accountID);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.cID]);

  /* ─────────── Derived helpers ─────────── */
  const activeTx   = useMemo(() => tx.filter(t => t.accountID === activeId), [tx, activeId]);
  const totalCash  = useMemo(() => accounts.reduce((s,a)=>s+a.balance, 0), [accounts]);
  const thisMonth  = new Date().toISOString().slice(0,7);      // “2025‑04”
  const monthTx    = tx.filter(t => t.tDate.startsWith(thisMonth));

  /* line‑chart data: running balance */
  const lineData = useMemo(() => {
    let bal = accounts.find(a=>a.accountID===activeId)?.balance || 0;
    return [...activeTx]
      .sort((a,b)=>new Date(a.tDate).getTime()-new Date(b.tDate).getTime())
      .map(t => ({ date: t.tDate.slice(5,10), bal: (bal += t.amount) }));
  }, [activeTx, accounts, activeId]);

  /* pie‑chart data: naive “category” buckets pulled from description keywords */
  const cats = ["grocery","rent","fuel","salary","transfer"];
  const pie = useMemo(() => {
    const m: Record<string,number> = {};
    cats.forEach(c => m[c]=0);
    activeTx.forEach(t => {
      const key = cats.find(c => t.description.toLowerCase().includes(c)) || "other";
      m[key] = (m[key] || 0) + Math.abs(t.amount);
    });
    return Object.entries(m).map(([name,value])=>({name,value}));
  }, [activeTx]);

  /* bar‑chart data: spend vs income each month (all accounts) */
  const bar = useMemo(() => {
    const map: Record<string,{income:number,spend:number}> = {};
    tx.forEach(t=>{
      const ym = t.tDate.slice(0,7);
      if (!map[ym]) map[ym] = {income:0,spend:0};
      if (t.amount >= 0) map[ym].income +=  t.amount;
      else               map[ym].spend  += -t.amount;
    });
    return Object.entries(map).map(([month,{income,spend}])=>({month,income,spend}));
  }, [tx]);

  if (loading) return <p className="text-center text-xl py-20">Loading dashboard…</p>;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* MAIN PANE */}
      <main className="flex-1 overflow-y-auto bg-gray-800 p-6 text-white">

        {/* ---- greeting / kpis ---- */}
        <h1 className="text-3xl font-light mb-8">
          Welcome back, {user?.firstName ?? "Customer"}!
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Kpi title="Total balance" value={`$${totalCash.toLocaleString()}`} />
          <Kpi title="Accounts"      value={accounts.length} />
          <Kpi title="Tx this month" value={monthTx.length} />
          <Kpi title="Avg. spend / tx" value={
            monthTx.length
              ? `$${(monthTx.reduce((s,t)=>s+Math.abs(t.amount),0)/monthTx.length).toFixed(2)}`
              : "—"
          } />
        </div>

        {/* ---- accounts cards ---- */}
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

        {/* ---- charts ---- */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* balance history */}
          <ChartBox title="Balance history">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="bal" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>

          {/* spend categories */}
          <ChartBox title="Spending categories">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pie}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {pie.map((_,i)=><Cell key={i} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          {/* monthly spend vs income */}
          <ChartBox title="Income / Spend by month" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" stackId="a" />
                <Bar dataKey="spend"  stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>
      </main>

      {/* RIGHT SIDEBAR – keep your sticky market widgets etc. */}
      <aside className="w-96 shrink-0 sticky top-0 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-lg font-medium mb-2">Markets</h2>
        <div className="h-52 bg-gray-700 rounded">box 1…</div>
        <div className="h-52 bg-gray-700 rounded">box 2…</div>
        <div className="h-52 bg-gray-700 rounded">box 3…</div>
      </aside>
    </div>
  );
}

/* ────────── tiny helpers ────────── */
function Kpi({ title, value }:{title:string,value:string|number}) {
  return (
    <div className="bg-gray-900 rounded px-4 py-6">
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}
function ChartBox({ title, children, className="" }:{title:string, children:React.ReactNode, className?:string}) {
  return (
    <div className={`bg-gray-900 rounded p-4 ${className}`}>
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      {children}
    </div>
  );
}
