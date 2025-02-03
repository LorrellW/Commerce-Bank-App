// components/Navbar.js

import React from "react";
import Link from "next/link";
import layout from "@/app/layout";

const Navbar = () =>{
    return(
        <nav className="navbar flex-row  font-geist-mono items-center p-4">
        <h2 className="navbar flex-row font-geist-mono text-2xl">Fortune400</h2>

        <div className="nav-link-all flex w-min-screen bg-white justify-center font-geist-mono text-lg p-8 space-x-20">
        
        <Link className="text-black hover:text-gray-700" href="/">Home</Link>

        <Link className="text-black  hover:text-gray-700" href="/account">Account</Link>

        <Link className="text-black hover:text-gray-700" href="/taxes">Taxes</Link>

        <Link className="text-black hover:text-gray-700" href="/Ai">Ai</Link>

        <Link className="text-black hover:text-gray-700" href="/settings">Settings</Link>
        </div>
        </nav>
    );
};
export default Navbar