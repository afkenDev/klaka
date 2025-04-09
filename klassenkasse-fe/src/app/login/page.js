"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import "../styles/login.css";
import { supabase } from "../lib/supabaseClient.js";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (user && !userError) {
                router.push('/klassen');
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = `${username}@kbw.ch`;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // 👉 Zusatz: Prüfen, ob der Fehler auf fehlendes Passwort hindeutet
            const { data: userData, error: getUserErr } = await supabase.auth.getUserByEmail(email);

            if (!getUserErr && userData?.user?.app_metadata?.provider === 'email') {
                setError("⚠️ Du hast noch kein Passwort gesetzt.");
                setTimeout(() => router.push('/login/set-password'), 1500);
            } else {
                setError("Login fehlgeschlagen. Bitte prüfe deine Eingaben.");
            }

            setSuccess("");
        } else {
            setError("");
            setSuccess("Login erfolgreich!");
            setTimeout(() => router.push('/klassen'), 1000);
        }
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

                    <button type="submit" className="login-submit-button">Login</button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </form>
            </div>
        </div>
    );
}
