'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/settings.css"
import { Eye, EyeClosed } from 'lucide-react'; // <--- Icon Import

export default function EinstellungenPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) {
        router.push('/login');
        return;
      }

      setEmail(user.email);

      const { data: profile } = await supabase
        .from('user_profile')
        .select('role_id')
        .eq('id', user.id)
        .single();

      const roleName = profile?.role_id === 2 ? 'Admin' : 'Lehrer';
      setRole(roleName);
    };

    fetchData();
  }, [router]);

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage('Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage('Fehler beim Ändern des Passworts.');
    } else {
      setMessage('Passwort erfolgreich geändert.');
      setNewPassword('');
    }
  };

  return (
    <div className='page-wrapper'>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '5rem auto' }}>
        <h1>Einstellungen</h1>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input type="text" value={email} disabled style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Rolle:</label>
          <input type="text" value={role} disabled style={{ width: '100%', padding: '0.5rem' }} />
        </div>

        <div className="passwort-container">
  <label>Neues Passwort:</label>
  <div className="passwort-input-wrapper">
    <input
      type={showPassword ? 'text' : 'password'}
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="Neues Passwort eingeben"
      className="passwort-input"
      autoComplete="new-password" // <--- verhindert Browser-Symbol
    />
    <span className="passwort-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeClosed /> : <Eye />}
    </span>
  </div>
</div>


        <button
          onClick={handlePasswordChange}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#009EE0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Passwort ändern
        </button>

        {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      </div>
    </div>
  );
}
