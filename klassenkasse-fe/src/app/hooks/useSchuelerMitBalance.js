'use client'
import { useEffect, useState } from 'react';

export function useSchuelerMitBalance() {
  const [data, setData] = useState({
    schueler: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSchuelerMitBalance = async () => {
      try {
        const response = await fetch('/api/getSchuelerMitBalance', {
          method: 'POST',
        });

        const result = await response.json();

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
  console.log("legidata, ", data)
  return data;
}
