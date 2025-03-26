import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useParams } from 'next/navigation'; // Damit wir die class_id bekommen

export function useBalance() {
    const { id } = useParams(); // Holt die aktuelle class_id aus der URL

    const [data, setData] = useState({
        balance: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const { data, error } = await supabase
                    .from("balance")
                    .select("id, name, amount, date, updated_at, operator, class_id")
                    .eq("class_id", id); // Nur Einträge mit der passenden class_id abrufen

                if (error) throw error;

                setData({
                    balance: data,
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error("Fehler beim Laden:", err);
                setData(prev => ({ ...prev, error: err.message, loading: false }));
            }
        };

        if (id) fetchBalance(); // Nur laden, wenn class_id vorhanden ist

    }, [id]); // Aktualisiert sich, wenn sich die class_id ändert

    return data;
}
