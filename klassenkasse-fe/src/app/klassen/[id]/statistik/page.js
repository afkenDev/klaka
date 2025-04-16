'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { useKlassenName } from '../../../hooks/useKlassenName';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import '../../../styles/statistik.css';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';


// Sample data (replace with your actual data)
const COLORS = ['#00C49F', '#0088FE', '#FF8042', '#FF0000', '#FFBB28', '#8884d8', '#999999'];

// Fixed color mapping for subjects
const FIXED_COLORS = {
    'Mathematik': '#0088FE',      // Blau
    'Deutsch': '#00C49F',         // Grün
    'Englisch': '#FF0000',        // Rot
    'Sport': '#FF8042',           // Dunkelrot
    'Informatik': '#FFCC00',      // Dunkelgelb
    'Sonstiges': '#888888',       // Grau
    'Französisch': '#FFFF00',     // Gelb
    'Physik': '#000000',          // Schwarz
    'Chemie': '#8B4513',          // Braun
    'Biologie': '#006400',        // Dunkelgrün
    'Geographie': '#FFA500',      // Orange
    'Geschichte': '#FFB347',      // Hellorange
    'Wirtschaft&Recht': '#8A2BE2', // Violett
    'Musik': '#FF69B4',           // Pink
    'Bildnerisches Gestalten': '#FFB6C1', // Hellpink
    'Rechnungswesen': '#00008B',   // Dunkelblau
};

export default function StatistikPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);  // Neu: Gesamtbetrag

    const classId = params?.id || '';
    //const { id: classId, loading: IDloading, error: IDerror } = useKlassenId(klassenname);

    useEffect(() => {
        if (!classId) return;

        const fetchData = async () => {
            // Alle balance-Einträge der Klasse holen, nur mit operator '-'
            const { data: balanceEntries, error: balanceError } = await supabase
                .from('balance')
                .select('id, amount, fach, operator')
                .eq('class_id', classId)
                .eq('operator', '-'); // Nur Einträge mit operator '-'

            if (balanceError) {
                console.error('Fehler beim Laden der balance-Einträge:', balanceError);
                return;
            }

            // Alle Einträge aus der schueler_balance Tabelle holen
            const { data: schuelerBalances, error: sbError } = await supabase
                .from('schueler_balance')
                .select('balance_id');

            if (sbError) {
                console.error('Fehler beim Laden der schueler_balance-Einträge:', sbError);
                return;
            }

            // Häufigkeit jeder balance_id zählen
            const balanceCounts = {};
            schuelerBalances.forEach(({ balance_id }) => {
                balanceCounts[balance_id] = (balanceCounts[balance_id] || 0) + 1;
            });

            // Beträge pro Fach summieren, multipliziert mit der Anzahl der Schüler
            const grouped = {};
            let total = 0;  // Gesamtbetrag, der berechnet wird
            balanceEntries.forEach(entry => {
                const subject = entry.fach || 'Unbekannt';
                const multiplier = balanceCounts[entry.id] || 0;
                const entryTotal = entry.amount * multiplier;
                grouped[subject] = (grouped[subject] || 0) + entryTotal;
                total += entryTotal;  // Gesamtbetrag wird kumuliert
            });

            const pieData = Object.entries(grouped)
                .map(([subject, total]) => ({
                    name: subject,
                    value: total
                }))
                .filter(entry => entry.value > 0); // 👈 Filter für > 0


            setData(pieData);
            setTotalAmount(total);  // Gesamtbetrag setzen
        };

        fetchData();
    }, [classId]);

    // if (IDloading) return <div>Lade...</div>;
    // if (IDerror) return <div className="container">Fehler: {IDerror.message}</div>;

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="title">Gesamte Beträge pro Fach</h1>

                <div className='controls'>
                    <button
                        onClick={() => router.push(`/klassen/${classId}`)}
                    >
                        ← Zurück
                    </button>
                </div>
                <div className="content">
                    {data.length === 0 ? (
                        <p>Lade...</p>
                    ) : (
                        <>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            innerRadius={0}
                                            dataKey="value"
                                            nameKey="name"
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, outerRadius, percent, index }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = outerRadius * 1.1;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                
                                                // Only show label for segments that are large enough
                                                if (percent < 0.05) return null;
                                                
                                                return (
                                                    <text 
                                                        x={x} 
                                                        y={y} 
                                                        fill="#333"
                                                        textAnchor={x > cx ? 'start' : 'end'}
                                                        dominantBaseline="central"
                                                        className="recharts-pie-label-text"
                                                    >
                                                        {`${data[index].name} (${data[index].value} CHF)`}
                                                    </text>
                                                );
                                            }}
                                        >
                                            {data.map((entry, index) => {
                                                const color = FIXED_COLORS[entry.name] || COLORS[index % COLORS.length];
                                                return <Cell key={`cell-${index}`} fill={color} />;
                                            })}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => [`${value} CHF`, 'Betrag']}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                padding: '10px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}
                                        />
                                        <Legend 
                                            layout="horizontal" 
                                            verticalAlign="bottom" 
                                            align="center"
                                            wrapperStyle={{
                                                paddingTop: '20px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="total-amount">
                                <h2>Gesamtbetrag</h2>
                                <div className="amount">
                                    <span>{totalAmount}</span>
                                    <span className="currency">CHF</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
