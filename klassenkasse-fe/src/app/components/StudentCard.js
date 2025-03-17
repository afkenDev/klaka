import { useState } from 'react';
import '../styles/student.css';
// components/StudentCard.js
export default function StudentCard({ student, onToggleDropdown, isOpen }) {
    const studentBalance = student.balance || [];

    // Berechne den Saldo, sichere den Wert von 'balance'
    const balance = studentBalance.reduce((sum, b) => {
        const amount = parseFloat(b.amount);  // Versuche, die Menge als Zahl zu interpretieren
        if (!isNaN(amount)) {
            return b.operator === '-' ? sum - amount : sum + amount;
        }
        return sum;  // Falls 'amount' keine Zahl ist, nichts ändern
    }, 0);

    // Sicherstellen, dass 'balance' eine Zahl ist und 'toFixed' anwendbar ist
    const formattedBalance = (typeof balance === 'number' && !isNaN(balance)) ? balance.toFixed(2) : '0.00';

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
                <button className='btn-abbuchung'>Abbuchen ✈</button>
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
                                studentBalance.map((b, index) => (
                                    <tr key={index}>
                                        <td>{b.name}</td>
                                        <td>
                                            {b.operator === '-' ? '-' : '+'}
                                            {isNaN(b.amount) ? '0.00' : parseFloat(b.amount).toFixed(2)} Fr.
                                        </td>
                                        <td>{b.date}</td>
                                        <td>
                                            <button className="btn-delete">Löschen</button>
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
