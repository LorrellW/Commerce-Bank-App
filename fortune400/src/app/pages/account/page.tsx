"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import Protected from "@/app/components/Protected";
import VoiceflowChatbot from "@/app/components/VoiceFlowChatbot";

// API response types
interface AccountAPI { accountID: number; accountType: string; balance: string; }
interface TransactionAPI { tID: number; tDate: string; amount: string; description: string; category: string; merchant: string | null; }
interface CustomerData { accounts: AccountAPI[]; transactions: TransactionAPI[]; customer?: unknown; }

// Client-side types
interface Account { id: number; name: string; type: string; balance: number; }
type Transaction = { tID: number; tDate: string; amount: number; description: string; category: string; merchant: string | null; };
interface Insights { categories: Record<string, Transaction[]>; }

export default function AccountPage() {
  const { user } = useUser();
  const isAuth = Boolean(user?.cID);

  // State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [active, setActive] = useState<Account | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Record<string, Transaction[]>>({});
  const [loading, setLoading] = useState<{ initial: boolean; categorize: boolean }>({ initial: false, categorize: false });
  const [error, setError] = useState<string>("");
  const [showAllRaw, setShowAllRaw] = useState(false);
  const [showAllCategory, setShowAllCategory] = useState<Record<string, boolean>>({});

  // Professional ecommerce color map
  const colorMap: Record<string, string> = {
    groceries: "border-green-200",
    dining: "border-red-200",
    health: "border-pink-200",
    transportation: "border-yellow-200",
    utilities: "border-blue-200",
    travel: "border-indigo-200",
    shopping: "border-purple-200",
    education: "border-teal-200",
    entertainment: "border-orange-200",
    home: "border-gray-200",
    other: "border-neutral-200",
  };

  // Fetch accounts & raw transactions
  useEffect(() => {
    if (!user?.cID) return;
    setLoading(prev => ({ ...prev, initial: true }));
    setError("");

    axios.get<CustomerData>('/api/customer', { headers: { 'x-user-cid': user.cID } })
      .then(res => {
        const acctList: Account[] = res.data.accounts.map(a => ({ id: a.accountID, name: a.accountType, type: a.accountType, balance: Number(a.balance) }));
        setAccounts(acctList);
        setActive(prev => prev ?? acctList[0] ?? null);

        const txList: Transaction[] = res.data.transactions.map(t => ({ tID: t.tID, tDate: t.tDate, amount: Number(t.amount), description: t.description, category: t.category, merchant: t.merchant }));
        setTxs(txList);
      })
      .catch(e => { console.error(e); setError('Unable to load data'); })
      .finally(() => setLoading(prev => ({ ...prev, initial: false })));
  }, [user?.cID]);

  // Categorize on demand
  const handleCategorize = () => {
    if (!active) return;
    setLoading(prev => ({ ...prev, categorize: true }));
    setError("");

    axios.get<Insights>(`/api/gemini-transactions?accountID=${active.id}`)
      .then(res => setCategories(res.data.categories))
      .catch(e => { console.error(e); setError('Categorization failed'); })
      .finally(() => setLoading(prev => ({ ...prev, categorize: false })));
  };

  // Add new account (client-only stub)
  const handleAdd = () => {
    const name = window.prompt('Enter new account name');
    if (!name) return;
    const id = Date.now();
    const newAcc: Account = { id, name, type: name, balance: 0 };
    setAccounts(prev => [...prev, newAcc]);
    setActive(newAcc);
  };

  // Remove active account
  const handleRemove = () => {
    if (!active) return;
    const id = active.id;
    setAccounts(prev => prev.filter(a => a.id !== id));
    setActive(prev => {
      const remaining = prev ? accounts.filter(a => a.id !== id) : [];
      return remaining[0] ?? null;
    });
  };

  if (loading.initial) return <p className="p-8 text-center text-lg">Loading…</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <Protected isAuthenticated={isAuth}>
      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* Header: Account Cards, Add/Remove */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-4 overflow-auto">
            {accounts.map(acc => (
              <div key={acc.id} onClick={() => setActive(acc)} className={`cursor-pointer w-52 h-28 bg-white rounded-2xl shadow-lg p-4 flex flex-col justify-between border-4 ${active?.id === acc.id ? 'border-blue-500' : 'border-transparent'} hover:border-gray-300`}>
                <span className="font-semibold text-lg text-gray-800">{acc.name}</span>
                <span className="text-gray-600">${acc.balance.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-4">
            <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">Add Account</button>
            <button onClick={handleRemove} disabled={!active} className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50">Remove Account</button>
          </div>
        </div>

        {/* Main Grid: Transactions & Categorize */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Transactions Table */}
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
                      <td className="px-4 py-2 text-sm text-gray-700">{new Date(tx.tDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{tx.description}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 text-right">${tx.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {txs.length > 10 && (
                <div className="mt-4 text-center">
                  <button onClick={() => setShowAllRaw(s => !s)} className="text-blue-600 hover:underline">
                    {showAllRaw ? 'Show Less' : `Show All (${txs.length - 10} more)`}
                  </button>
                </div>
              )}
            </div>
            {/* Categorized Cards */}
            {Object.entries(categories).map(([cat, txList]) => {
              const isAll = showAllCategory[cat] || false;
              const displayList = isAll ? txList : txList.slice(0, 10);
              return (
                <div key={cat} className={`bg-white p-6 rounded-lg shadow border-l-4 ${colorMap[cat] || 'border-gray-200'}`}>
                  <h3 className="text-xl font-semibold mb-3">{cat.charAt(0).toUpperCase() + cat.slice(1)} ({txList.length})</h3>
                  <ul className="divide-y divide-gray-100">
                    {displayList.map(tx => (
                      <li key={tx.tID} className="flex justify-between py-2">
                        <span className="text-sm text-gray-800">{new Date(tx.tDate).toLocaleDateString()} — {tx.description}</span>
                        <span className="text-sm font-medium text-gray-800">${Number(tx.amount).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  {txList.length > 10 && (
                    <div className="mt-3 text-right">
                      <button onClick={() => setShowAllCategory(s => ({ ...s, [cat]: !isAll }))} className="text-blue-600 hover:underline">
                        {isAll ? 'Show Less' : `Show All (${txList.length - 10} more)`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Right: Flashy Categorize Button */}
          <div className="flex justify-center lg:justify-end items-start">
            {active && (
              <div className="sticky top-24">
                <button onClick={handleCategorize} disabled={loading.categorize} className="flex flex-col items-center px-6 py-4 bg-gradient-to-r from-blue-600 via-teal-400 to-green-500 text-white font-bold rounded-full shadow-lg transform transition duration-300 hover:scale-105 disabled:opacity-50">
                  <span className="text-lg mb-1">{loading.categorize ? '🔄 Processing…' : '⚡️ Categorize'}</span>
                  <span className="text-xs uppercase tracking-wide">Powered by Gemini</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Chatbot */}
        <VoiceflowChatbot />
      </section>
    </Protected>
  );
}
