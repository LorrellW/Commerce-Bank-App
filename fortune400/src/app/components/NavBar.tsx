import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/F4-logo.png";

const Navbar = () => {
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
      <div className="flex justify-center text-sm space-x-16 font-geist-mono">
        <Link className="text-black hover:text-gray-700" href="/">Home</Link>
        <Link className="text-black hover:text-gray-700" href="/pages/account">Account</Link>
        <Link className="text-black hover:text-gray-700" href="/pages/taxes">Dashboard</Link>
        <Link className="text-black hover:text-gray-700" href="/pages/Ai">Services</Link>
        <Link className="text-black hover:text-gray-700" href="/pages/settings">Settings</Link>
      </div>

      {/* Right Section - Placeholder (Add Content Here) */}
      <div className="flex justify-end space-x-4 ">
        {/* Add buttons, user profile, icons, or any other content */}
        <button className="bg-secondary rounded-md text-sm text-primary px-4 py-2 ">Login</button>
        <button className="bg-primary text-white text-sm rounded-md px-4 py-2 ">Signup</button>
      </div>
    </nav>
  );
};

export default Navbar;
