// app/pages/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";

/* ─────────────── types that match the API ─────────────── */
interface AccountAPI {
  accountID: number;
  accountType: string;
  balance: string;         // comes back as text from Postgres
}

interface Account {
  id: number;
  name: string;
  type: string;
  balance: number;
}

interface Transaction {
  tID: number;
  tDate: string;
  amount: number;
  description: string;
}

export default function AccountPage() {
  const { user } = useUser();

  /* ───────── local state ───────── */
  const [accounts,      setAccounts]      = useState<Account[]>([]);
  const [active,        setActive]        = useState<Account | null>(null);
  const [transactions,  setTransactions]  = useState<Transaction[]>([]);
  const [loadingAcc,    setLoadingAcc]    = useState(false);
  const [loadingTx,     setLoadingTx]     = useState(false);
  const [err,           setErr]           = useState("");

  /* ───────── fetch ACCOUNTS once we know cID ───────── */
  useEffect(() => {
    if (!user?.cID) return;               // still waiting for Context
    setLoadingAcc(true);
    axios
      .get("/api/accounts", { headers: { "x-user-cid": user.cID } })
      .then(res => {
        const rows: AccountAPI[] = res.data?.accounts ?? [];
        const list: Account[] = rows.map(r => ({
          id:       r.accountID,
          name:     r.accountType,        // use nicer label if you like
          type:     r.accountType,
          balance:  Number(r.balance)
        }));
        setAccounts(list);
        setActive(a => a ?? list[0] ?? null);   // pick first one on first load
        setErr("");
      })
      .catch(e => setErr("Could not load accounts"))
      .finally(() => setLoadingAcc(false));
  }, [user?.cID]);

  /* ───────── fetch TRANSACTIONS every time active id changes ───────── */
  useEffect(() => {
    if (!active) return;
    setLoadingTx(true);
    axios
      .get("/api/transactions", { headers: { "x-account-id": active.id } })
      .then(res => {
        setTransactions(res.data?.transactions ?? []);
        setErr("");
      })
      .catch(e => setErr("Could not load transactions"))
      .finally(() => setLoadingTx(false));
  }, [active?.id]);

  /* ───────── UI branches ───────── */
  if (loadingAcc) return <p className="p-10 text-center text-xl">Loading accounts…</p>;
  if (err)        return <p className="p-10 text-center text-xl text-red-600">{err}</p>;

  return (
    <section className="px-6 py-10">
      <h1 className="text-5xl text-center font-light text-black pb-16">
        {user ? `${user.firstName} ${user.lastName}` : "Guest"}&apos;s accounts
      </h1>

      {/* ───── account selector ───── */}
      {accounts.length === 0 ? (
        <p className="text-center text-lg mb-12">No accounts yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6 place-items-center mb-12">
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => setActive(acc)}
              className={`relative w-52 h-28 bg-[url('/blueCC.jpg')] bg-cover border text-white rounded-xl shadow-lg transition
                         ${active?.id === acc.id ? "ring-4 ring-cyan-500" : "hover:shadow-zinc-600"}`}
            >
              <span className="relative z-10 text-lg font-semibold pl-6 top-6 block">
                {acc.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ───── active account summary ───── */}
      {active && (
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full table-auto border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Type</th>
                <th className="px-6 py-3 border-b">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-700 bg-white">
                <td className="px-6 py-4 border-b">{active.name}</td>
                <td className="px-6 py-4 border-b">{active.type}</td>
                <td className="px-6 py-4 border-b">${active.balance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ───── transactions for the active account ───── */}
      {active && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl text-black mb-4">Recent transactions</h2>
          {loadingTx ? (
            <p>Loading transactions…</p>
          ) : transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table className="min-w-full table-auto border border-gray-300 rounded">
              <thead>
                <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
                  <th className="px-6 py-3 border-b">Date</th>
                  <th className="px-6 py-3 border-b">Description</th>
                  <th className="px-6 py-3 border-b">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.tID} className="text-gray-700 bg-white">
                    <td className="px-6 py-2 border-b">
                      {new Date(tx.tDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-2 border-b">{tx.description}</td>
                    <td className="px-6 py-2 border-b">
                      ${Number(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
