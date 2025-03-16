'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../styles/student.css';
import { useSchueler } from '../../hooks/useSchueler';
import { useBalance } from '../../hooks/useBalance';
import { useSchuelerMitBalance } from '../../hooks/useSchuelerMitBalance';

export default function ClassDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { schueler: fetchedSchueler, loading: loadingSchueler, error: errorSchueler } = useSchuelerMitBalance();
    const [localSchueler, setLocalSchueler] = useState([]);
    const [openStudent, setOpenStudent] = useState(null);

    if (loadingSchueler) return <div className="container">Lade Daten...</div>;
    if (errorSchueler) return <div className="container">Fehler: {errorSchueler}</div>;

    const allSchueler = [...fetchedSchueler, ...localSchueler];

    const toggleDropdown = (studentId) => {
        setOpenStudent(openStudent === studentId ? null : studentId);
    };

    // Filtern der Schüler nach der Klassen-ID
    const filteredSchueler = allSchueler.filter(schueler => String(schueler.class) === String(id));


    return (
        <div className="container">
            <button onClick={() => router.push('/klassen')}>← Klasse {id}</button>
            <div className="student-list">
                {filteredSchueler.length > 0 ? (
                    filteredSchueler.map(student => {
                        const studentBalance = student.balance || [];

                        return (
                            <div key={student.id} className="student-card" onClick={() => toggleDropdown(student.id)}>
                                <div className="student-header">
                                    <span>{student.name + " " + student.surname}</span>
                                    <span style={{
                                        color: studentBalance.reduce((sum, b) =>
                                            b.operator === '-' ? sum - b.amount : sum + b.amount, 0) < 0 ? 'red' : 'green'
                                    }}>
                                        {studentBalance.reduce((sum, b) =>
                                            b.operator === '-' ? sum - b.amount : sum + b.amount, 0
                                        ).toFixed(2) || "0.00"} Fr.-
                                    </span>
                                    <button className='btn-abbuchung'>Abbuchen ✈</button>
                                </div>
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
                                                {studentBalance.length > 0 ? (
                                                    studentBalance.map((b, index) => (
                                                        <tr key={index}>
                                                            <td>{b.name}</td>
                                                            <td>{b.operator === '-' ? '-' : '+'}{b.amount.toFixed(2)} Fr.</td>
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
                    })
                ) : (
                    <p>Keine Schüler in dieser Klasse.</p>
                )}
            </div>

            <div className="actions">
                <button className="btn-orange">Buchung</button>
                <button className="btn-black">Schüler:in hinzufügen</button>
                <button className="btn-black">Liste exportieren</button>
            </div>
        </div>
    );
}
