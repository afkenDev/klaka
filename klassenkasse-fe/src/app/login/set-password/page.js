"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import "../../styles/login.css";
import "../../styles/settings.css"; // Wichtig: deine Passwortfeld-CSS
import { Eye, EyeClosed } from "lucide-react"; // Toggle-Icons

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user || error) {
        console.log("Nicht eingeloggt – redirect zu /login");
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    const { error: pwError } = await supabase.auth.updateUser({
      password,
      data: {
        mustSetPassword: false
      }
    });

    if (pwError) {
      setError(`Fehler: ${pwError.message}`);
      setSuccess("");
    } else {
      setError("");
      setSuccess("Passwort erfolgreich gesetzt.");
      setTimeout(() => router.push("/klassen"), 1500);
    }
  };

  if (loading) return <p className="loading-text">Lade...</p>;

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Passwort setzen</h1>
        <p>Bitte wähle ein Passwort für zukünftige Logins.</p>

        <form onSubmit={handleSetPassword} className="login-form-fields">
          <div className="input-group passwort-container">
            <label htmlFor="password">Neues Passwort</label>
            <div className="passwort-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="passwort-input"
                autoComplete="new-password"
              />
              <span
                className="passwort-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </span>
            </div>
          </div>

          <button type="submit" className="login-submit-button">
            Passwort speichern
          </button>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
}
