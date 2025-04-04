'use client'
import { useEffect, useState } from 'react';

export function useSchuelerMitBalance() {
    const [data, setData] = useState({
        schueler: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchSchueler = async () => {
            const response = await fetch('/api/getSchueler', {
                method: 'POST',
            });

            const result = await response.json();
            if (!response.ok) {
                setData(prev => ({ ...prev, error: result.error, loading: false }));
            } else {
                setData({ schueler: result, loading: false, error: null });
            }
        };

        fetchSchueler();
    }, []);

    return data;
}
