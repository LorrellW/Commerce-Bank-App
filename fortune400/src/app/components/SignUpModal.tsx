"use client";

import { useState, FormEvent } from "react";
import { signUp } from "../../../Firbase/firebaseAuthService";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ open, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const user = await signUp(email, password, `${firstName} ${lastName}`);
      console.log("User signed up successfully:", user);
      onClose();
    } catch (err: unknown) {
      console.error("Error signing up:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during sign up.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
  <div className="bg-blue-100 rounded-lg shadow-lg w-full max-w-md p-8 relative scale-95 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary p-3 rounded-full text-white mb-2">
            {/* Optional icon can go here */}
          </div>
          <h2 className="text-3xl text-slate-500 font-normal">Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-black">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                className="mt-1 w-full rounded-md border border-gray-300 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-black">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                className="mt-1 w-full rounded-md border border-gray-300 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gray-300 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-gray-300 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
          >
            Sign Up
          </button>
        </form>

        <div className="flex justify-end mt-4 text-sm">
          <a href="#" className="text-primary hover:underline">
            Already have an account? Sign In
          </a>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-700 text-md"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SignUpModal;
