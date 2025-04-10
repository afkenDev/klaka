'use client'
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSchuelerMitBalance() {
  const [data, setData] = useState({
    schueler: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSchuelerMitBalance = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        const response = await fetch('/api/getSchuelerMitBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await response.json();
        console.log("useSchuelerMitBalance: ", result)
        if (!response.ok) {
          throw new Error(result.error || "Fehler beim Laden der Daten");
        }

        setData({
          schueler: result,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        setData(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    fetchSchuelerMitBalance();
  }, []);

  return data;
}
