import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useSchuelerMitBalance() {
  const [data, setData] = useState({
    schueler: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSchuelerMitBalance = async () => {
      try {
        // Abrufen der Schüler
        const { data: schueler, error: schuelerError } = await supabase
          .from("schueler")
          .select("id, name, surname, mail, mobile, class");

        if (schuelerError) throw schuelerError;

        // Abrufen der Zuordnungen in der Zwischentabelle schueler_balance
        const { data: schuelerBalance, error: balanceError } = await supabase
          .from("schueler_balance")
          .select("schueler_id, balance_id");

        if (balanceError) throw balanceError;

        // Abrufen der Balance-Einträge
        const { data: balances, error: balancesError } = await supabase
          .from("balance")
          .select("id, name, amount, date, updated_at, operator");

        if (balancesError) throw balancesError;

        // Verknüpfen der Schüler mit ihren Balance-Einträgen
        const schuelerMitBalance = schueler.map(s => ({
          ...s,
          balance: schuelerBalance
            .filter(sb => sb.schueler_id === s.id)
            .map(sb => balances.find(b => b.id === sb.balance_id))
            .filter(b => b !== undefined) // Entfernt nicht gefundene Balances
        }));

        setData({
          schueler: schuelerMitBalance,
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
