// NavBar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/Icons/F4-logo.png";
import { MenuOutlined } from "@ant-design/icons";
import { Button } from "antd";
import LoginComponent from "@/app/components/LoginModal";
import SignUpModal from "@/app/components/SignUpModal";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import app from "@/../Firbase/firebaseConfig"; // Adjust the path as needed

const auth = getAuth(app);

const Navbar: React.FC = () => {
  // State for toggling the hamburger menu and modals
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  
  // State for the currently authenticated user
  const [user, setUser] = useState<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };
  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleSignUpOpen = () => {
    setSignUpOpen(true);
  };
  const handleSignUpClose = () => {
    setSignUpOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log(user?.displayName, "Successfully Signed Out")
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <nav className="navbar top grid grid-cols-3 items-center px-8 py-4 bg-white">
      {/* Left Section - Logo */}
      <div className="flex items-center justify-start">
        <Image
          className="logo-style"
          src={Logo}
          alt="Fortune400 Logo"
          width={150}
          height={80}
          priority
        />
      </div>

      {/* Center Section - Navigation Links */}
      <div className="flex items-center justify-center">
        <div className="hidden lg:flex space-x-8 font-geist-mono text-sm">
          <Link href="/" className="relative group text-black hover:text-orange-700">
            Home
            <span className="absolute left-0 -top-3 h-1 w-auto bg-orange-300 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/pages/account" className="relative group text-black hover:text-orange-700">
            Account
            <span className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/pages/dashboard" className="relative group text-black hover:text-orange-700">
            Dashboard
            <span className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/pages/services" className="relative group text-black hover:text-orange-700">
            Services
            <span className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/pages/settings" className="relative group text-black hover:text-orange-700">
            Settings
            <span className="absolute left-0 -top-3 h-1 w-auto bg-orange-300 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>

      {/* Right Section - Login/Signup or Sign Out */}
      <div className="lg:grid hidden">
        <div className="flex justify-end space-x-4">
          {user ? (
            <button 
              onClick={handleSignOut}
              className="bg-secondary shadow-sm rounded-md text-sm text-primary px-4 py-2"
            >
              Sign Out
            </button>
          ) : (
            <>
              <button 
                onClick={handleLoginOpen}
                className="bg-secondary shadow-sm rounded-md text-sm text-primary px-4 py-2"
              >
                Login
              </button>
              {isLoginOpen && (
                <LoginComponent open={isLoginOpen} onClose={handleLoginClose} />
              )}
              <button
                onClick={handleSignUpOpen} 
                className="bg-primary shadow-sm text-white text-sm rounded-md px-4 py-2"
              >
                Signup
              </button>
              {isSignUpOpen && (
                <SignUpModal open={isSignUpOpen} onClose={handleSignUpClose} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden grid justify-items-end">
        <button onClick={handleClick} className="focus:outline-none">
          <MenuOutlined className="text-black text-4xl" />
        </button>
      </div>

      {/* Conditionally Rendered Hamburger Menu */}
      {isOpen && (
        <section className="fixed inset-0 z-50 w-screen">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)} />
          <div className="relative flex items-center justify-center h-full">
            <div className="grid grid-rows-6 border-black place-items-center gap-y-2 bg-slate-300 p-5 rounded-lg">
              <Link href="/" className="relative group text-black hover:text-orange-700" onClick={() => setIsOpen(false)}>
                Home
                <span className="absolute left-0 -bottom-1 h-1 w-auto bg-orange-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/pages/account" className="relative group text-black hover:text-orange-700" onClick={() => setIsOpen(false)}>
                Account
                <span className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/pages/dashboard" className="relative group text-black hover:text-orange-700" onClick={() => setIsOpen(false)}>
                Dashboard
                <span className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/pages/services" className="relative group text-black hover:text-orange-700" onClick={() => setIsOpen(false)}>
                Services
                <span className="absolute left-0 -bottom-1 h-1 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/pages/settings" className="relative group text-black hover:text-orange-700" onClick={() => setIsOpen(false)}>
                Settings
                <span className="absolute left-0 -bottom-1 h-1 w-auto bg-orange-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="flex gap-2">
                {user ? (
                  <Button onClick={handleSignOut}>Sign Out</Button>
                ) : (
                  <>
                    <Button onClick={handleLoginOpen}>Login</Button>
                    <Button onClick={handleSignUpOpen}>Sign Up</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </nav>
  );
};

export default Navbar;
