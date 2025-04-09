"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import '../../styles/login.css';

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('⚠️ Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(`❌ Fehler: ${error.message}`);
      setSuccess('');
    } else {
      setSuccess('✅ Passwort erfolgreich gesetzt!');
      setError('');
      setTimeout(() => router.push('/klassen'), 1500);
    }
  };

  if (loading) return <p className="loading-text">Lade...</p>;

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">🔐 Passwort setzen</h1>
        <p>Bitte wähle ein neues Passwort.</p>
        <form onSubmit={handleSetPassword} className="login-form-fields">
          <div className="input-group">
            <label htmlFor="password">Neues Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-submit-button">Passwort speichern</button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>
    </div>
  );
}
