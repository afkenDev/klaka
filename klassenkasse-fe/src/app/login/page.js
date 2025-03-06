"use client";
import Link from 'next/link';
import { useState } from "react";
import "../styles/login.css"; // Importiere die globale CSS-Datei

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        // Hier kannst du deine Login-Logik einfügen
        console.log("Benutzername:", username, "Passwort:", password);
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">Login</h1>

                <Link href="/">
                    <div className="back-arrow">←</div>
                </Link>

                <form onSubmit={handleLogin} className="login-form-fields">
                    <div className="input-group">
                        <label htmlFor="username">Benutzername</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Passwort</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-submit-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
