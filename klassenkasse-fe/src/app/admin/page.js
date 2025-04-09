"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/admin.css';

export default function Admin() {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');

  const [sqlInput, setSqlInput] = useState('');
  const [sqlOutput, setSqlOutput] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from('user_profile')
        .select('role_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role_id !== 2) {
        router.push('/');
      } else {
        setAccessGranted(true);
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      setInviteStatus('❌ Bitte E-Mail eingeben.');
      return;
    }
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail);
    if (error) {
      setInviteStatus(`❌ Fehler: ${error.message}`);
    } else {
      setInviteStatus('✅ Einladung erfolgreich gesendet!');
    }
  };

  const handleSqlQuery = async () => {
    try {
      const res = await fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlInput })
      });
      const result = await res.json();
      setSqlOutput(result);
    } catch (err) {
      setSqlOutput({ error: err.message });
    }
  };

  if (loading) return <p>Lade...</p>;
  if (!accessGranted) return null;

  return (
    <div className="admin-wrapper">
      <Navbar />
      <div className="admin-container">
        <h1>Adminbereich</h1>
        <p>Willkommen im Adminbereich! Du kannst hier sensible Daten verwalten.</p>

        <div className="admin-card">
          <h2>Benutzer einladen</h2>
          <input
            type="email"
            placeholder="E-Mail"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button onClick={handleInvite}>Einladung senden</button>
          {inviteStatus && <p>{inviteStatus}</p>}
        </div>

        <div className="admin-card">
          <h2>SQL-Abfrage</h2>
          <textarea
            rows={4}
            placeholder="Schreibe hier deine SQL..."
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
          ></textarea>
          <button onClick={handleSqlQuery}>SQL ausführen</button>
          {sqlOutput && (
            <pre className="sql-output">
              {JSON.stringify(sqlOutput, null, 2)}
            </pre>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
