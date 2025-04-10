'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSchueler() {
    const [data, setData] = useState({
        schueler: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchSchueler = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    throw new Error('Nicht eingeloggt');
                }

                const response = await fetch('/api/getSchueler', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Fehler beim Laden der Schülerdaten');
                }

                setData({ schueler: result, loading: false, error: null });

            } catch (err) {
                console.error("Fehler beim Abrufen der Schüler:", err);
                setData(prev => ({ ...prev, error: err.message, loading: false }));
            }
        };

        fetchSchueler();
    }, []);

    return data;
}
