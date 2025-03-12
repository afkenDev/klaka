'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../styles/student.css';

// Beispiel-Daten für verschiedene Klassen mit Buchungen
const classData = {
    1: [
        {
            id: 1, name: 'Kenz Abdelkebir', balance: 289.12,
            transactions: [
                { name: 'Taschenrechner', amount: 40.00, date: '01.01.2025' },
                { name: 'Schulausflug', amount: 120.00, date: '15.02.2025' }
            ]
        },
        {
            id: 2, name: 'Vincent Stucki', balance: 21389.12,
            transactions: [
                { name: 'Laptop', amount: 1500.00, date: '05.01.2025' },
                { name: 'Buch', amount: 25.00, date: '10.01.2025' }
            ]
        },
        {
            id: 3, name: 'Tihan Morrol', balance: -283.00,
            transactions: [
                { name: 'Exkursion', amount: 50.00, date: '22.02.2025' }
            ]
        },
    ]
};

export default function ClassDetail() {
    const { id } = useParams();
    const router = useRouter();

    // Lade Schüler basierend auf der Klassen-ID oder zeige eine leere Liste, falls keine Daten existieren
    const [students, setStudents] = useState(classData[id] || []);
    const [openStudent, setOpenStudent] = useState(null); // Speichert, welches Dropdown offen ist

    // Toggle für das Dropdown
    const toggleDropdown = (studentId) => {
        setOpenStudent(openStudent === studentId ? null : studentId);
    };

    // Funktion zum "Abbuchen"
    const handleWithdraw = (e, studentId) => {
        e.stopPropagation(); // Verhindert das Öffnen des Dropdowns

        setStudents(students.map(student =>
            student.id === studentId ? { ...student, balance: student.balance - 50 } : student
        ));
    };

    return (
        <div className="container">
            {/* Zurück-Button */}
            <button onClick={() => router.push('/klassen')}>← Klasse {id}</button>

            {/* Schülerliste */}
            <div className="student-list">
                {students.length > 0 ? (
                    students.map(student => (
                        <div key={student.id} className="student-card" onClick={() => toggleDropdown(student.id)}>
                            {/* Hauptinfo */}
                            <div className="student-header">
                                <span>{student.name}</span>
                                <span>{student.balance.toFixed(2)} Fr.-</span>
                                <button className='btn-abbuchung' onClick={(e) => handleWithdraw(e, student.id)}>
                                    Abbuchen ✈
                                </button>
                            </div>

                            {/* Dropdown mit Buchungen */}
                            {openStudent === student.id && (
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
                                            {student.transactions.length > 0 ? (
                                                student.transactions.map((transaction, index) => (
                                                    <tr key={index}>
                                                        <td>{transaction.name}</td>
                                                        <td>{transaction.amount} Fr.</td>
                                                        <td>{transaction.date}</td>
                                                        <td>✏</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">Keine Buchungen</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Keine Schüler in dieser Klasse.</p>
                )}
            </div>

            {/* Aktionen */}
            <div className="actions">
                <button className="btn-orange">Buchung</button>
                <button className="btn-black">Schüler:in hinzufügen</button>
                <button className="btn-black">Liste exportieren</button>
            </div>
        </div>
    );
}
