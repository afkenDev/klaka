"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import "../../styles/login.css"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/reset-password/new`,
    });

    if (error) {
      setError("Fehler beim Senden der E-Mail.");
    } else {
      setMessage("Passwort-Reset-E-Mail wurde gesendet.");
      setError("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Passwort zurücksetzen</h1>

        <Link href="/">
          <div className="back-arrow">←</div>
        </Link>

        <form onSubmit={handleReset} className="login-form-fields">
          <div className="input-group">
            <label htmlFor="email">E-Mail-Adresse</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-button">
            Link senden
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
