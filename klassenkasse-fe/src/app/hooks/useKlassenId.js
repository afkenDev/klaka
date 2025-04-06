import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useKlassenId(klassenname) {
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKlassenId = async () => {
            if (!klassenname) {
                setLoading(false);
                setId(null);
                return;
            }

            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                setError('Nicht eingeloggt');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/getKlassenId', {
                    method: 'POST',
                    body: JSON.stringify({ klassenname }),
                });

                const result = await response.json();

                if (!response.ok) {
                    setError(result.error || 'Fehler beim Laden der Klassen-ID');
                } else {
                    setId(result.id);
                }
            } catch (err) {
                setError('Netzwerkfehler beim Laden der Klassen-ID');
            }

            setLoading(false);
        };

        fetchKlassenId();
    }, [klassenname]);

    return { id, loading, error };
}
