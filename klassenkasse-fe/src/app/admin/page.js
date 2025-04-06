"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Admin() {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const checkAdmin = async () => {
      // 1️⃣ Eingeloggten User holen
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push('/login'); // Nicht eingeloggt → zurück zum Login
        return;
      }

      // 2️⃣ Aus user_profile den role_id laden
      const { data: profile, error: profileError } = await supabase
        .from('user_profile')
        .select('role_id')
        .eq('id', user.id)
        .single();

        console.log("User-ID:", user.id);
        console.log("Profile:", profile);

      if (profileError || !profile || profile.role_id !== 2) {
        router.push('/'); // Kein Admin → zurück zur Startseite
      } else {
        setAccessGranted(true); // ✅ Zugriff erlaubt
      }

      setLoading(false);
    };



    checkAdmin();
  }, [router]);
  
  if (loading) return <p>Lade...</p>;

  if (!accessGranted) return null; // Nicht anzeigen, wenn kein Zugriff

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>🛠 Adminbereich</h1>
        <p>Willkommen im Adminbereich! Du kannst hier sensible Daten verwalten.</p>
      </div>
      <Footer />
    </>
  );
}  