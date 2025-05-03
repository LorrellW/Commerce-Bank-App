// app/pages/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/app/context/UserContext";
import Protected from "@/app/components/Protected";

interface Customer {
  cID: number;
  email: string;
  phoneNumber: string | null;
  firebase_uid: string;
  firstName: string;
  lastName: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}

interface Account {
  accountID: number;
  accountType: string;
  creationDate: string;
  closeDate: string | null;
  balance: string;        // numeric comes back as string
}

interface Transaction {
  tID: number;
  accountID: number;
  tDate: string;
  amount: string;
  description: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const isAuthenticated = Boolean(user?.cID);

  const [profile, setProfile] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user?.cID) return;
    axios
      .get("/api/customer", { headers: { "x-user-cid": user.cID } })
      .then((res) => {
        setProfile(res.data.customer);
        setAccounts(res.data.accounts);
        setTxs(res.data.transactions);
      })
      .catch((e) => {
        console.error(e);
        setErr("Failed to load customer data");
      });
  }, [user?.cID]);

  return (
    <Protected isAuthenticated={isAuthenticated}>
      {err && (
        <p className="text-red-600 text-center py-10">{err}</p>
      )}

      {!err && !profile && (
        <p className="text-center py-10">Loading…</p>
      )}

      {!err && profile && (
        <section className="px-6 py-10 text-black">
          <h1 className="text-4xl mb-6">
            Welcome {profile.firstName} {profile.lastName}
          </h1>

          {/* --- customer info --- */}
          <h2 className="text-2xl mb-2">Profile details</h2>
          <table className="mb-10 border">
            <tbody>
              {Object.entries(profile).map(([k, v]) => (
                <tr key={k}>
                  <th className="border px-3 py-1 text-left bg-gray-200">
                    {k}
                  </th>
                  <td className="border px-3 py-1">{v ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- accounts --- */}
          <h2 className="text-2xl mb-2">Accounts</h2>
          {accounts.length === 0 ? (
            <p className="mb-10">No accounts yet</p>
          ) : (
            <table className="mb-10 border w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2">ID</th>
                  <th className="border px-2">Type</th>
                  <th className="border px-2">Opened</th>
                  <th className="border px-2">Closed</th>
                  <th className="border px-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.accountID}>
                    <td className="border px-2">{a.accountID}</td>
                    <td className="border px-2">{a.accountType}</td>
                    <td className="border px-2">{a.creationDate}</td>
                    <td className="border px-2">
                      {a.closeDate ?? "—"}
                    </td>
                    <td className="border px-2">
                      ${Number(a.balance).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* --- transactions --- */}
          <h2 className="text-2xl mb-2">Transactions</h2>
          {txs.length === 0 ? (
            <p>No transactions recorded.</p>
          ) : (
            <table className="border w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2">tID</th>
                  <th className="border px-2">Account</th>
                  <th className="border px-2">Date</th>
                  <th className="border px-2">Amount</th>
                  <th className="border px-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.tID}>
                    <td className="border px-2">{t.tID}</td>
                    <td className="border px-2">{t.accountID}</td>
                    <td className="border px-2">
                      {new Date(t.tDate).toLocaleDateString()}
                    </td>
                    <td className="border px-2">
                      ${Number(t.amount).toFixed(2)}
                    </td>
                    <td className="border px-2">{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </Protected>
  );
}
