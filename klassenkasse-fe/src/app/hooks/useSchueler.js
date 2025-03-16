import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useSchueler() {
    const [data, setData] = useState({
        schueler: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchSchueler = async () => {
            try {
                // Abrufen der Daten aus der Supabase-Tabelle "schueler"
                const { data, error } = await supabase.from("schueler").select("id, name, surname, mail, mobile, class");

                if (error) throw error;

                setData({
                    schueler: data,
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error("Fehler beim Laden der Schüler:", err);
                setData(prev => ({ ...prev, error: err.message, loading: false }));
            }
        };

        fetchSchueler();
    }, []);

    return data;
}
