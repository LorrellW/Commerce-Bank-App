//app/pages/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";

interface Account {
  key: string;
  name: string;
  type: string;
  amount: number;
}

interface Transaction {
  tID: number;
  tDate: string;
  amount: number;
  description: string;
}

export default function AccountPage() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({ name: "", type: "", amount: 0 });

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => {
    setFormValues({ name: "", type: "", amount: 0 });
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user?.cID) {
        console.warn("Missing user.cID, skipping fetchAccounts()");
        console.log(user?.cID, "user.CID")
        console.log(user?.uid, "user.uID - firebase")
        return;
      }

      try {
        const res = await fetch("/api/account", {
          headers: {
            "x-user-cid": String(user.cID),
          },
        });

        const json = await res.json();
        console.log("Fetched accounts:", json);

        if (json.success && Array.isArray(json.accounts)) {
          const formatted = json.accounts.map((acc: any) => ({
            key: String(acc.accountID),
            name: acc.accountType,
            type: acc.accountType,
            amount: parseFloat(acc.balance),
          }));
          setAccounts(formatted);
          if (!activeAccount && formatted.length > 0) {
            setActiveAccount(formatted[0]);
          }
        } else {
          console.warn("Account fetch failed or returned no accounts:", json.message);
        }
      } catch (error) {
        console.log("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [user?.cID]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!activeAccount?.key) {
        console.warn("Missing activeAccount.key, skipping fetchTransactions()");
        return;
      }

      try {
        const res = await fetch("/api/transactions", {
          headers: {
            "x-account-id": activeAccount.key,
          },
        });

        const data = await res.json();
        console.log("Fetched transactions:", data);

        if (data.success && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [activeAccount]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAccount: Account = {
      key: String(accounts.length + 1),
      ...formValues,
    };
    setAccounts([...accounts, newAccount]);
    setActiveAccount(newAccount);
    closeModal();
  };

  if (!activeAccount) return <p className="w-screen h-[600px] p-10 text-center text-black justify-center place-content-center text-xl">Loading accounts...</p>;

  return (
    <section className="px-6 py-10">
      <h1 className="text-5xl text-center font-light text-black pb-16">
        {user ? `${user.firstName} ${user.lastName}` : "Guest"}&apos;s account
      </h1>

      <div className="grid grid-cols-3 gap-6 place-items-center mb-12">
        {accounts.map((account) => (
          <button
            key={account.key}
            onClick={() => setActiveAccount(account)}
            className="relative w-52 h-28 bg-[url('/blueCC.jpg')] bg-cover border text-white rounded-xl shadow-lg hover:shadow-zinc-600 transition overflow-hidden"
          >
            <div className="relative z-10 text-lg font-semibold pl-6 rounded">
              {account.name}
            </div>
          </button>
        ))}

        <button
          onClick={showModal}
          className="flex items-center justify-center w-48 h-28 border border-cyan-700 bg-gray-100 text-black rounded-xl font-bold shadow hover:shadow-md transition"
        >
          Add New Account<br />➕
        </button>
      </div>

      <div className="overflow-x-auto mb-10">
        <table className="min-w-full table-auto border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200 text-left text-sm uppercase text-gray-600">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Type</th>
              <th className="px-6 py-3 border-b">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-700 bg-white">
              <td className="px-6 py-4 border-b">{activeAccount.name}</td>
              <td className="px-6 py-4 border-b">{activeAccount.type}</td>
              <td className="px-6 py-4 border-b">${activeAccount.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Account</h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 px-3 py-2 border text-black border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 px-3 py-2 border text-black border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formValues.type}
                  onChange={(e) => setFormValues({ ...formValues, type: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  required
                  className="w-full mt-1 px-3 py-2 border text-black border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={formValues.amount}
                  onChange={(e) =>
                    setFormValues({ ...formValues, amount: Number(e.target.value) })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-400 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-cyan-700 rounded hover:bg-cyan-800"
                >
                  Create Account
                </button>
              </div>
            </form>

            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}