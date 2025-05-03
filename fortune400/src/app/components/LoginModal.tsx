// components/LoginModal.tsx
"use client";

import { useState, FormEvent } from "react";
import { signIn } from "@/../Firbase/firebaseAuthService";
import { LockOutlined } from "@ant-design/icons";
import SuccessModal from "./SuccessModal";
import { useUser } from "@/app/context/UserContext";
import axios from "axios";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { setUser } = useUser();       // ← pull in setUser
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      // 1. Sign in with Firebase
      const fbUser = await signIn(email, password);

      // 2. Fetch your customer record to get cID, firstName, lastName
      const { data: profile } = await axios.get("/api/getCustomer", {
        params: { uid: fbUser.uid },
      });
      // assume profile = { customer: { cID, firstName, lastName } }

      // 3. Populate your UserContext exactly as Sign-Up does
      setUser({
        uid:         fbUser.uid,
        email:       fbUser.email || email,
        displayName: fbUser.displayName || "",
        firstName:   profile.customer.firstName,
        lastName:    profile.customer.lastName,
        cID:         profile.customer.cID,
      });

      // 4. Show success and close
      setSuccessMsg(`Welcome back, ${profile.customer.firstName}!`);
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Unable to sign in");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        {showSuccess && (
          <SuccessModal message={successMsg} onClose={handleSuccessClose} />
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}
