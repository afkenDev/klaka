'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useKlassenName(id) {
    const [klassenname, setKlassenname] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKlassenName = async () => {
            if (!id) {
                setLoading(false);
                setKlassenname(null);
                return;
            }

            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    setError('Nicht eingeloggt');
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/getKlassenName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ id }),
                });

                const result = await response.json();

                if (!response.ok) {
                    setError(result.error || 'Fehler beim Laden des Klassennamens');
                } else {
                    setKlassenname(result.klassenname);
                }
            } catch (err) {
                setError('Netzwerkfehler beim Laden des Klassennamens');
            }

            setLoading(false);
        };

        fetchKlassenName();
    }, [id]);

    return { klassenname, loading, error };
}
