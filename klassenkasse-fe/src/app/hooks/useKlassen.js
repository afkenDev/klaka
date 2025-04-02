import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useKlassen() {
  const [klassen, setKlassen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKlassen = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('Nicht eingeloggt');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/getData', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Fehler beim Laden der Klassen');
      } else {
        setKlassen(result);
      }

      setLoading(false);
    };

    fetchKlassen();
  }, []);

  return { klassen, loading, error };
}
