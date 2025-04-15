import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js'; // Falls du eine Datei hast, die den Supabase-Client exportiert

export default function StudentCard({ student, onToggleDropdown, isOpen, onOpenSettings, onDeleteTransaction }) {
    const studentBalance = student.balance || [];

    const balance = studentBalance.reduce((sum, b) => {
        const amount = parseFloat(b.amount);
        if (!isNaN(amount)) {
            return b.operator === '-' ? sum - amount : sum + amount;
        }
        return sum;
    }, 0);

    const formattedBalance = (typeof balance === 'number' && !isNaN(balance)) ? balance.toFixed(2) : '0.00';

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const sortedBalance = [...studentBalance].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('.');
        const [dayB, monthB, yearB] = b.date.split('.');
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        if (dateA.getTime() === dateB.getTime()) {
            return b.id - a.id; // Höhere ID zuerst bei gleichem Datum
        }

        return dateB - dateA; // Neueste zuerst
    });



    return (
        <div
            key={student.id}
            className={`student-card ${balance < 0 ? 'negative-balance' : ''}`}
            onClick={() => onToggleDropdown(student.id)}
        >
            <div className="student-header">
                <span className="student-name">{student.name + " " + student.surname}</span>
                <span className="student-balance">
                    {formattedBalance} Fr.-
                </span>
                <button className="btn-abbuchung" onClick={(event) => {
                    event.stopPropagation();
                    onOpenSettings(student);
                }}>Einstellung ✈</button>
            </div>
            {isOpen && (
                <div className="transaction-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Betrag</th>
                                <th>Datum</th>
                                <th>Bearbeitung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentBalance.length > 0 ? (
                                sortedBalance.map((b, index) => (
                                    <tr key={index}>
                                        <td>{b.name}</td>
                                        <td>
                                            {b.operator === '-' ? '-' : '+'}
                                            {isNaN(b.amount) ? '0.00' : parseFloat(b.amount).toFixed(2)} Fr.
                                        </td>
                                        <td>{b.date}</td>
                                        <td>
                                            <button
                                                className="btn-delete"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    console.log("Lösche Buchung mit", { schuelerId: student.id, balanceId: b.id });
                                                    onDeleteTransaction(student.id, b.id);
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Lösche...' : 'Entfernen'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Keine Buchungen vorhanden</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
