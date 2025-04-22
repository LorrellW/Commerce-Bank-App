// components/SignUpModal.tsx
"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import axios from "axios";
import { signUp } from "@/../Firbase/firebaseAuthService";
import { useUser } from "@/app/context/UserContext";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onClose }) => {
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /* submit ─────────────────────────────────────────────── */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const f = new FormData(e.currentTarget);
    const firstName = f.get("firstName") as string;
    const lastName  = f.get("lastName")  as string;
    const email     = f.get("email")     as string;
    const password  = f.get("password")  as string;
    const street    = f.get("street")    as string;
    const city      = f.get("city")      as string;
    const state     = f.get("state")     as string;
    const zip       = f.get("zip")       as string;
    const country   = f.get("country")   as string;

    try {
      /* 1️⃣  Firebase account */
      const fbUser = await signUp(email, password, `${firstName} ${lastName}`);

      /* 2️⃣  Insert / fetch customer in Postgres */
      const { data } = await axios.post("/api/register", {
        firebase_uid: fbUser.uid,
        firstName, lastName, email,
        street, city, state, zip, country
      });

      /* 3️⃣  Global state (one shot) */
      setUser({
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.displayName || `${firstName} ${lastName}`,
        //photoURL: fbUser.photoURL || "",
        firstName,
        lastName,
        cID: data.customer.cID
      });

      onClose();
      router.push('/pages/profile');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Sign-up failed.");
    }
  };

  if (!open) return null;

  /* UI ─────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-blue-100 rounded-lg shadow-lg w-full max-w-lg p-9 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-3xl text-center text-slate-600 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name row */}
          <div className="grid grid-cols-2 gap-6 text-black">
            <div>
              <label className="block text-sm font-medium text-black">First Name</label>
              <input name="firstName" 
                     autoComplete="given-name" 
                     required
                     className="input h-8 w-full rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Last Name</label>
              <input name="lastName"
                     autoComplete="family-name" 
                     required
                     className="input h-8 rounded-md w-full" />
            </div>
            </div>

          {/* email + password */}
          <div className="grid grid-cols-2 gap-6">
          <div className="text-black">
            <label className="block text-sm font-medium text-black">Email</label>
            <input name="email"
                   type="email" 
                   autoComplete="email" 
                   required 
                   className="input h-8 rounded-md w-full" />
          </div>
          <div className="text-black">
            <label className="block text-sm font-medium text-black">Password</label>
            <input name="password" 
                   type="password" 
                   autoComplete="new-password" 
                   required 
                   className="input h-8 rounded-md w-full" />
          </div>
          </div>
          

          {/* address */}
          <div className="text-black ">
            <label className="block text-sm font-medium text-black">Address</label>
            <input name="street"
                   placeholder="  Street"
                   className="input h-8 rounded-md w-full" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <input name="city"
                   placeholder="  City"   
                   className="input h-8 rounded-md" />

            <input name="state"  
                   placeholder="  State"  
                   className="input h-8 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-6 pb-8">
            <input name="zip"     
                   placeholder="  ZIP"    
                   className="input h-8 rounded-md" />

            <input name="country" 
                   placeholder="  Country" 
                   className="input h-8 rounded-md" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

/* Tailwind alias for brevity */
const input = "mt-1 w-full rounded-md border border-gray-300 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
export default SignUpModal;
