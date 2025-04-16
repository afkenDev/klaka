"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import "../../../styles/login.css";
import { Eye, EyeClosed } from "lucide-react";

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

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
  
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        setError("Ungültiger oder abgelaufener Link.");
      } else {
        setConfirmed(true);
      }
    };

    getSession();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Fehler beim Setzen des Passworts.");
      setSuccess("");
    } else {
      setSuccess("Passwort erfolgreich geändert. Weiterleitung...");
      setError("");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Neues Passwort setzen</h1>

        {!confirmed ? (
          <p>Lade Bestätigung...</p>
        ) : (
          <form onSubmit={handleUpdatePassword} className="login-form-fields">
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
        )}
      </div>
    </div>
  );
}
