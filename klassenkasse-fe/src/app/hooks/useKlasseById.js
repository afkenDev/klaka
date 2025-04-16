// hooks/useKlasseById.js
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useKlasseById(classId) {
    const [klasse, setKlasse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!classId) return;

        const fetchKlasse = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                setError('Nicht eingeloggt');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/getKlasseById', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ classId }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Fehler beim Laden');
            } else {
                setKlasse(result);
            }

            setLoading(false);
        };

        fetchKlasse();
    }, [classId]);

    return { klasse, loading, error };
}
