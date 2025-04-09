"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import "../styles/login.css";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        router.push("/klassen");
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = username.includes("@") ? username : `${username}@kbw.ch`;

    // 1. Existenz prüfen
    const res = await fetch("/api/user-exists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const { userExists } = await res.json();

    if (!userExists) {
      setError("Benutzer oder E-Mail existiert nicht.");
      setSuccess("");
      return;
    }
    console.log("Benutzer existiert laut API:", userExists);
    console.log("Login-Daten:", { email, password });
    
    // 2. Login mit Passwort versuchen
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        console.log("Fehler beim Passwort-Login:", error.message);
      }
      
    
      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          // Prüfe via API ob ein Passwort gesetzt wurde
          const metaRes = await fetch("/api/user-meta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
      
          const metaData = await metaRes.json();
      
          if (metaData?.mustSetPassword) {
            setError("Dieses Konto hat noch kein Passwort.");
            setTimeout(() => router.push("/login/set-password"), 2000);
          } else {
            setError("Falsches Passwort. Bitte erneut versuchen.");
          }
      
          return;
        }
      
        setError("Unbekannter Fehler beim Login.");
        return;
      }
      

    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user?.user_metadata?.mustSetPassword) {
      router.push("/login/set-password");
    } else {
      setError("");
      setSuccess("Login erfolgreich.");
      setTimeout(() => router.push("/klassen"), 1000);
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
            <label htmlFor="username">Benutzername oder E-Mail</label>
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

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
}
