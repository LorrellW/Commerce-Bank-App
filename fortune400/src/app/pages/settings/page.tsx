/* ------------------------------------------------------------------ */
/*  SETTINGS / PROFILE PAGE – lint‑clean                              */
/* ------------------------------------------------------------------ */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter }            from "next/navigation";
import axios                    from "axios";
import { useUser }              from "@/app/context/UserContext";

/* ------------------------------ types ----------------------------- */
type Msg = { kind: "ok" | "err"; text: string };

/* --------------------------- component ---------------------------- */
export default function SettingsPage() {

  //-------------gloabal auth state----------------// 
  const { user, setUser } = useUser();
  const router            = useRouter();

  /* local form state */
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName,  setLastName ] = useState(user?.lastName  ?? "");
  const [email,     setEmail    ] = useState(user?.email     ?? "");
  const [street,    setStreet   ] = useState("");
  const [city,      setCity     ] = useState("");
  const [province,  setProvince ] = useState("");   // ← renamed from “state”
  const [zip,       setZip      ] = useState("");
  const [country,   setCountry  ] = useState("");
  const [msg,       setMsg      ] = useState<Msg | null>(null);

  /* pre‑fill whenever user appears / changes */
  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName ?? "");
    setLastName (user.lastName  ?? "");
    setEmail    (user.email     ?? "");
  }, [user]);

  /* -------------------------------------------------- submit handler */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.uid) {
      setMsg({ kind: "err", text: "You must be logged‑in first." });
      return;
    }

    try {
      const { data } = await axios.post("/api/register", {
        firstName,
        lastName,
        email,
        street,
        city,
        state: province,      // DB column name is “state”
        zip,
        country,
        firebase_uid: user.uid,
      });

      if (!data?.success) throw new Error(data?.message ?? "Unknown error");

      /* single context update */
      setUser({
        ...user,
        cID: data.customer.cID,
        firstName,
        lastName,
      });
      setMsg({ kind: "ok", text: "Profile saved!" });
    } catch (err: unknown) {
      /* safe narrowing without “any” */
      const message =
        err instanceof Error ? err.message : "Save failed – unknown error";
      console.error(err);
      setMsg({ kind: "err", text: message });
    }
  };

  /* ----------------------------------------------------------- UI -- */
  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-10 pb-20">
      <h1 className="text-4xl font-light mb-8 text-gray-900">
        Profile settings
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* ───────────────── PERSONAL INFO ───────────────── */}
        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-700">
            Personal information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
          </div>
        </section>

        {/* ───────────────── ADDRESS ─────────────────────── */}
        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-700">Address</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street address
              </label>
              <input
                value={street}
                onChange={e => setStreet(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State / Province
              </label>
              <input
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP
              </label>
              <input
                value={zip}
                onChange={e => setZip(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full rounded border px-3 py-2 text-black"
              >
                <option value="">Select…</option>
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>
        </section>

        {/* ───────────────── ACTIONS / MESSAGE ───────────── */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-gray-700 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded"
          >
            Save
          </button>
        </div>

        {msg && (
          <p
            className={`text-sm ${
              msg.kind === "ok" ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg.text}
          </p>
        )}
      </form>
    </div>
  );
}
