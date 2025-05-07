"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import Protected from "@/app/components/Protected";
import VoiceflowChatbot from "@/app/components/VoiceFlowChatbot";
import Image from "next/image";
import GGL from "../../../../public/google-gemini.png";

/* ─── API & client types ────────────────────────── */
interface AccountAPI { accountID: number; accountType: string; balance: string; }
interface TransactionAPI { tID: number; tDate: string; amount: string; description: string; category: string; merchant: string | null; }
interface CustomerData { accounts: AccountAPI[]; transactions: TransactionAPI[]; }
interface Insights { categories: Record<string, Transaction[]>; }

interface Account { id: number; name: string; type: string; balance: number; }
type Transaction = { tID: number; tDate: string; amount: number; description: string; category: string; merchant: string | null; };

/* ─── Border‑color map per category ─────────────── */
const colorMap: Record<string, string> = {
  groceries: "border-green-300",
  dining: "border-red-300",
  health: "border-pink-300",
  transportation: "border-yellow-300",
  utilities: "border-blue-300",
  travel: "border-indigo-300",
  shopping: "border-purple-300",
  education: "border-teal-300",
  entertainment: "border-orange-300",
  home: "border-gray-300",
  other: "border-neutral-300",
};

export default function AccountPage() {
  const { user } = useUser();
  const isAuth = Boolean(user?.cID);

  /* ─── State ───────────────────────────────────── */
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [active, setActive] = useState<Account | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Record<string, Transaction[]>>({});
  const [showAllRaw, setShowAllRaw] = useState(false);
  const [showAllCat, setShowAllCat] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState({ initial: false, categorize: false });
  const [error, setError] = useState("");

  /* ─── Fetch accounts & raw txs ─────────────────── */
  useEffect(() => {
    if (!user?.cID) return;
    setLoading(l => ({ ...l, initial: true }));
    setError("");

    axios
      .get<CustomerData>("/api/customer", { headers: { "x-user-cid": user.cID } })
      .then(res => {
        const acctList = res.data.accounts.map<Account>(a => ({
          id: a.accountID,
          name: a.accountType,
          type: a.accountType,
          balance: Number(a.balance),
        }));
        setAccounts(acctList);
        setActive(prev => prev ?? acctList[0] ?? null);

        const txList = res.data.transactions.map<Transaction>(t => ({
          tID: t.tID,
          tDate: t.tDate,
          amount: Number(t.amount),
          description: t.description,
          category: t.category,
          merchant: t.merchant,
        }));
        setTxs(txList);
      })
      .catch(e => {
        console.error(e);
        setError("Unable to load data");
      })
      .finally(() => setLoading(l => ({ ...l, initial: false })));
  }, [user?.cID]);

  /* ─── Categorize click ─────────────────────────── */
  const handleCategorize = () => {
    if (!active) return;
    setLoading(l => ({ ...l, categorize: true }));
    setError("");

    axios
      .get<Insights>(`/api/gemini-transactions?accountID=${active.id}`)
      .then(res => setCategories(res.data.categories))
      .catch(e => {
        console.error(e);
        setError("Categorization failed");
      })
      .finally(() => setLoading(l => ({ ...l, categorize: false })));
  };

  /* ─── Add & Remove accounts (client stubs) ─────── */
  const handleAdd = () => {
    const name = window.prompt("Enter new account name");
    if (!name) return;
    const newAcc: Account = { id: Date.now(), name, type: name, balance: 0 };
    setAccounts(a => [...a, newAcc]);
    setActive(newAcc);
  };
  const handleRemove = () => {
    if (!active) return;
    setAccounts(a => a.filter(ac => ac.id !== active.id));
    setActive(a => accounts.filter(ac => ac.id !== active.id)[0] ?? null);
  };

  /* ─── Loading / error guards ───────────────────── */
  if (loading.initial) return <p className="p-8 text-center text-lg">Loading…</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  /* ─── UI ───────────────────────────────────────── */
  return (
    <Protected isAuthenticated={isAuth}>
      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* Account cards + actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-4 overflow-auto">
            {accounts.map(acc => (
              <div
                key={acc.id}
                onClick={() => setActive(acc)}
                className={`cursor-pointer w-52 h-28 bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between border-4
                ${active?.id === acc.id ? "border-blue-500" : "border-transparent"} hover:border-gray-300`}
              >
                <span className="font-semibold text-lg text-gray-800">{acc.name}</span>
                <span className="text-gray-600">${acc.balance.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex space-x-4 ">
            <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
              Add Account
            </button>
            <button
              onClick={handleRemove}
              disabled={!active}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50"
            >
              Remove Account
            </button>
          </div>
        </div>

        {/* 50 / 50 grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: raw transactions */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(showAllRaw ? txs : txs.slice(0, 10)).map(tx => (
                    <tr key={tx.tID} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{new Date(tx.tDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-sm">{tx.description}</td>
                      <td className="px-4 py-2 text-sm text-right">${tx.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {txs.length > 10 && (
                <div className="mt-4 text-center">
                  <button onClick={() => setShowAllRaw(s => !s)} className="text-blue-600 hover:underline">
                    {showAllRaw ? "Show Less" : `Show All (${txs.length - 10} more)`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: categorize button + colored cards */}
          <div className="space-y-8">

            {/* Sticky categorize btn w/ Gemini logo */}
            {active && (
              <div className="top-24 flex flex-col items-center lg:items-center">
                <button
                  onClick={handleCategorize}
                  disabled={loading.categorize}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-black via-blue-400 to-black
                  text-white font-bold rounded-md shadow-md transition-transform duration-300
                  hover:scale-105 disabled:opacity-50"
                >
                  <span className="text-lg">{loading.categorize ? "🔄 Processing…" : "⚡️ Categorize"}</span>
                </button>
                <div className="mt-3 flex items-center space-x-1">
                  <span className="text-xs tracking-wide text-gray-600">POWERED BY</span>
                  <Image src={GGL} alt="Google Gemini" width={80} height={24} />
                </div>
              </div>
            )}

            {/* Colored category cards */}
            {Object.entries(categories).map(([cat, list]) => {
              const showAll = showAllCat[cat] ?? false;
              const display = showAll ? list : list.slice(0, 10);
              return (
                <div
                  key={cat}
                  className={`bg-white p-6 rounded-lg shadow border-l-4 ${colorMap[cat] || "border-neutral-300"}`}
                >
                  <h3 className="text-xl font-semibold mb-3 capitalize">
                    {cat} ({list.length})
                  </h3>
                  <ul className="divide-y divide-gray-100">
                    {display.map(tx => (
                      <li key={tx.tID} className="flex justify-between py-2">
                        <span className="text-sm text-gray-800">
                          {new Date(tx.tDate).toLocaleDateString()} — {tx.description}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          ${Number(tx.amount).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {list.length > 10 && (
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => setShowAllCat(prev => ({ ...prev, [cat]: !showAll }))}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {showAll ? "Show Less" : `Show All (${list.length - 10} more)`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Chatbot */}
        <VoiceflowChatbot />
      </section>
    </Protected>
  );
}
