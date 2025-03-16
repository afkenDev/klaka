import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useKlassen() {
  const [data, setData] = useState({
    klassen: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchKlassen = async () => {
      try {
        // Abrufen der Daten aus der Supabase-Tabelle "klasse"
        const { data, error } = await supabase.from("klasse").select("*");

        if (error) throw error;

        // Extrahiere die eindeutigen Lehrer-Namen
        const uniqueLehrer = [
          ...new Set(data.map(item => item.vorname + ' ' + item.nachname)) // Lehrername als Vorname + Nachname
        ];

        setData({
          klassen: data,
          lehrer: uniqueLehrer,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Fehler beim Laden der Klassen:", err);
        setData(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    fetchKlassen();
  }, []);

  return data;
}
