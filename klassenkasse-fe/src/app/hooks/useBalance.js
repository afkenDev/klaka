import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useBalance() {
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
                    .select("id, name, amount, date, updated_at, operator");

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

        fetchBalance();
    }, []);

    return data;
}
