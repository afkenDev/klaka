'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import '../styles/layout.css';

export default function Navbar() {
  const [currentSemester, setCurrentSemester] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initials, setInitials] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // 📅 Semester berechnen
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const semester = today >= new Date(year, 7, 1) ? `HS ${year}` : `FS ${year}`;
    setCurrentSemester(semester);
  }, []);

  // 👤 Benutzer laden + Rolle prüfen
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) return;

      setUser(user);

      const { data: profile } = await supabase
        .from('user_profile')
        .select('role_id')
        .eq('id', user.id)
        .single();

      if (profile?.role_id === 2) {
        setIsAdmin(true);
      }

      // Initialen setzen (z. B. "AM" für "admin@kbw.ch")
      const email = user.email || '';
      const name = email.split('@')[0]; // z. B. "admin"
      const initials = name
        .split(/[.\-_]/) // auf Punkt oder Unterstrich splitten
        .map(n => n[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

      setInitials(initials || 'U');
    };

    fetchUser();
  }, []);

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      {/* Logo links */}
      <div className="navbar-logo">
        <Link href="/">
          <Image src="/pic/logo-small.png" alt="Logo" width={130} height={100} />
        </Link>
      </div>

      {/* Rechts: Semester, Navigation & User */}
      <div className="navbar-right">
        <span className="navbar-semester">{currentSemester}</span>
        <Link href="/klassen">
          <span className="navbar-klass">Klassenübersicht</span>
        </Link>

        {/* Wenn User eingeloggt ist */}
        {user ? (
          <>
            {isAdmin && (
              <Link href="/admin">
                <span className="navbar-klass">Adminbereich</span>
              </Link>
            )}
            <div className="navbar-profile" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="profile-initials">{initials}</span>
              {menuOpen && (
                <div className="profile-menu">
    <Link href="/settings">
    <button className="profile-menu-item">Einstellungen</button>
    </Link>
                  <button className="profile-menu-item" onClick={handleLogout}>Abmelden</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
