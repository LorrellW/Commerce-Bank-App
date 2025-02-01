// components/Navbar.js

import React from "react";
import Link from "next/link";
import layout from "@/app/layout";

const Navbar = () =>{
    return(
        <nav className="navbar flex font-geist-mono flex-row items-center p-4">
        <h2 className="navbar flex-row font-geist-mono">This is the NavBar</h2>
        <div className="nav-links flex font-geist-mono text-xl bg-red ml-20 space-x-4">
        <Link href="/">Home</Link>
        <Link href="/account">Account</Link>
        <Link href="/taxes">Taxes</Link>
        <Link href="/Ai">Ai</Link>
        <Link href="/settings">Settings</Link>
        </div>
        </nav>
    );
};
export default Navbar