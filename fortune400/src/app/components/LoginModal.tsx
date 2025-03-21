"use client";

import { useState, FormEvent } from "react";
import { signIn } from "@/../Firbase/firebaseAuthService";
import { LockOutlined } from "@ant-design/icons"; // Optional replacement for Lock icon

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ open, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      const user = await signIn(email, password);
      console.log("User signed in successfully:", user.displayName);
      onClose(); // Close the modal on success
    } catch (err: unknown) {
      console.error("Error signing in:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during sign in.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-blue-100 rounded-lg shadow-lg w-full max-w-sm p-7 relative">
        <div className="flex flex-col items-center">
          <div className="py-2 text-3xl rounded-full text-blue-700">
            <LockOutlined className="" />
          </div>
          <h2 className="text-3xl text-slate-500 font-normal mb-4">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-gray-300 text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <a href="#" className="text-primary hover:underline">
            Forgot password?
          </a>
          <a href="#" className="text-primary hover:underline ">
            Don’t have an account? Sign Up
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

export default SignInModal;
