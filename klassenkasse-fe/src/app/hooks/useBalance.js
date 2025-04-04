import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export function useBalance() {
    const { id: classId } = useParams();

    const [data, setData] = useState({
        balance: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!classId) return; // Warten, bis classId verfügbar ist

        const fetchBalance = async () => {
            try {
                const response = await fetch('/api/getBalance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ classId })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Fehler beim Abrufen der Balance-Daten');
                }

                setData({
                    balance: result,
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error("Fehler beim Laden:", err);
                setData(prev => ({ ...prev, error: err.message, loading: false }));
            }
        };

        fetchBalance();
    }, [classId]);

    return data;
}
