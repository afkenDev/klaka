'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useBalance(classId) {
    const [data, setData] = useState({
        balance: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!classId) return;

        const fetchBalance = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    throw new Error('Nicht eingeloggt');
                }

                const response = await fetch('/api/getBalance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ classId }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Fehler beim Abrufen der Balance-Daten');
                }

                setData({ balance: result, loading: false, error: null });

            } catch (err) {
                console.error("Fehler beim Abrufen der Balance:", err);
                setData(prev => ({ ...prev, error: err.message, loading: false }));
            }
        };

        fetchBalance();
    }, [classId]);

    return data;
}
