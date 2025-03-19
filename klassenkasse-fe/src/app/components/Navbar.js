"use client";

import Image from "next/image";
import Link from 'next/link'; // Importiere Link von Next.js
import '../styles/layout.css'

export default function Navbar() {
    return (
        <nav className="navbar">
            {/* Logo links */}
            <div className="navbar-logo">
                <a href="/">
                <Image src="/pic/logo-small.png" alt="Logo" width={130} height={100} />

                </a>
            </div>

            {/* Login + Semester + Klassenübersicht rechts */}
            <div className="navbar-right">
                <span className="navbar-semester">Semester</span>
                <span className="navbar-klass">Klassenübersicht</span>

                {/* Login Button als Link */}
                <Link href="/login">
                    <button className="login-button">Login</button>
                </Link>
            </div>
        </nav>
    );
}
