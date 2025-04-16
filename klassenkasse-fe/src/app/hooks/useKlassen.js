import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useKlassen() {
  const [klassen, setKlassen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKlassen = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Nicht eingeloggt');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Fehler beim Laden');
      } else {
        setKlassen(result);
      }

      setLoading(false);
    };

    fetchKlassen();
  }, []);

  return { klassen, loading, error };
}
