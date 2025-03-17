'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../styles/student.css';
import { useSchueler } from '../../hooks/useSchueler';
import { useBalance } from '../../hooks/useBalance';
import { useSchuelerMitBalance } from '../../hooks/useSchuelerMitBalance';
import * as XLSX from 'xlsx'; // Import für Excel-Verarbeitung

export default function ClassDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { schueler: fetchedSchueler, loading: loadingSchueler, error: errorSchueler } = useSchuelerMitBalance();
    const [localSchueler, setLocalSchueler] = useState([]);
    const [openStudent, setOpenStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        surname: '',
        mobile: '',
    });

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [bookingData, setBookingData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0], // Heutiges Datum als Default
        operator: '-',
    });

    const [importFile, setImportFile] = useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Zustand für das Öffnen des Modals

    if (loadingSchueler) return <div className="container">Lade Daten...</div>;
    if (errorSchueler) return <div className="container">Fehler: {errorSchueler}</div>;

    const allSchueler = [...fetchedSchueler, ...localSchueler];

    const toggleDropdown = (studentId) => {
        setOpenStudent(openStudent === studentId ? null : studentId);
    };

    // Filtern der Schüler nach der Klassen-ID
    const filteredSchueler = allSchueler.filter(schueler => String(schueler.class) === String(id));

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewStudent({ name: '', surname: '', mobile: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddStudent = async () => {
        const { name, surname, mobile } = newStudent;

        if (!name || !surname) return;

        console.log('Klasse ID:', id);

        const email = `${name.toLowerCase()}.${surname.toLowerCase()}@stud.kbw.ch`;
        const studentData = { name, surname, email, mobile, class: String(id) };
        console.log("Data: ", studentData);
        try {
            const response = await fetch('/api/schueler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Hinzufügen des Schülers');

            setLocalSchueler((prev) => [...prev, data.data[0]]);
            handleCloseModal();
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Schülers:', error);
            alert('Es gab einen Fehler beim Hinzufügen des Schülers: ' + error.message);
        }
    };



    // Funktion zum Öffnen des Modals
    const handleImportOpenModal = () => setIsImportModalOpen(true);

    // Funktion zum Schließen des Modals
    const handleImportCloseModal = () => setIsImportModalOpen(false);

    // Funktion zum Handhaben der Datei-Import
    const handleImportCSV = async () => {
        if (!importFile) return;

        const formData = new FormData();
        formData.append('file', importFile);

        try {
            const response = await fetch('/api/schueler', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log("Data: ", data)
            console.log("data.data: ", data.data)
            if (!response.ok) {
                throw new Error(data.message || 'Fehler beim Importieren der Datei');
            }

            if (Array.isArray(data.data)) {
                setLocalSchueler((prev) => [...prev, ...data.data]); // Nur falls es ein Array ist
            } else {
                console.warn('Erwartetes Array nicht erhalten:', data.data);
            }

            handleImportCloseModal();

        } catch (error) {
            console.error('Fehler beim Import:', error);
            alert(error.message || 'Es gab einen Fehler beim Import der Datei.');
        }
    };


    //Buchung
    // 🔹 Öffnet das Buchungs-Pop-up
    const handleOpenBookingModal = () => setIsBookingModalOpen(true);

    // 🔹 Schließt das Buchungs-Pop-up
    const handleCloseBookingModal = () => {
        setIsBookingModalOpen(false);
        setBookingData({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });
        setSelectedStudents([]);
    };

    // 🔹 Handhabt Eingaben für Titel, Betrag, Datum
    const handleBookingInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Schüler auswählen (einzeln)
    const handleSelectStudent = (schuelerId) => {
        setSelectedStudents(prev =>
            prev.includes(schuelerId) ? prev.filter(id => id !== schuelerId) : [...prev, schuelerId]
        );
    };

    // 🔹 Alle Schüler auswählen
    const handleSelectAll = () => {
        if (selectedStudents.length === filteredSchueler.length) {
            setSelectedStudents([]); // Falls alle ausgewählt sind, abwählen
        } else {
            setSelectedStudents(filteredSchueler.map(s => s.id)); // Alle hinzufügen
        }
    };

    // 🔹 Buchung speichern
    const handleSaveBooking = async () => {
        if (!bookingData.title || !bookingData.amount || selectedStudents.length === 0) {
            alert('Bitte alle Felder ausfüllen und mindestens einen Schüler auswählen.');
            return;
        }

        const bookingPayload = {
            name: bookingData.title,
            amount: parseFloat(bookingData.amount),
            date: bookingData.date,
            operator: bookingData.operator,
            students: selectedStudents,
        };

        try {
            const response = await fetch('/api/buchungen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Speichern der Buchung');

            alert('Buchung erfolgreich gespeichert!');

            // Neuen Balance-Datensatz zu den Schülern in `localSchueler` hinzufügen
            const updatedSchueler = [...localSchueler];

            // Aktualisierung der Schüler-Daten mit der neuen Buchung
            selectedStudents.forEach((studentId) => {
                const student = updatedSchueler.find(s => s.id === studentId);
                if (student) {
                    const newBalance = {
                        name: bookingData.title,
                        amount: bookingData.amount,
                        date: bookingData.date,
                        operator: bookingData.operator,
                    };

                    if (!student.balance) {
                        student.balance = [];
                    }

                    student.balance.push(newBalance);
                }
            });
            console.log("updated: ", updatedSchueler)
            // Update `localSchueler` mit den neuen Balance-Werten
            setLocalSchueler(updatedSchueler);
            console.log("local: ", localSchueler);
            handleCloseBookingModal();
        } catch (error) {
            console.error('Fehler beim Speichern der Buchung:', error);
            alert('Es gab einen Fehler beim Speichern der Buchung: ' + error.message);
        }
    };




    return (
        <div className="container">
            <button onClick={() => router.push('/klassen')}>← Klasse {id}</button>
            <div className="student-list">
                {filteredSchueler.length > 0 ? (
                    filteredSchueler.map(student => {
                        const studentBalance = student.balance || [];

                        return (
                            <div 
                            key={student.id} 
                            className={`student-card ${studentBalance.reduce((sum, b) =>
                                b.operator === '-' ? sum - b.amount : sum + b.amount, 0) < 0 ? 'negative-balance' : ''}`} 
                            onClick={() => toggleDropdown(student.id)}
                        >
                            <div className="student-header">
                                <span className="student-name">{student.name + " " + student.surname}</span>
                                <span className="student-balance">
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
                <button className="btn-orange" onClick={handleOpenBookingModal}>Buchung hinzufügen</button>
                <button className="btn-black" onClick={handleOpenModal}>Schüler:in hinzufügen</button>
                <button className="btn-black" onClick={handleImportOpenModal}>Liste importieren</button>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Neuen Schüler hinzufügen</h2>
                        <input
                            type="text"
                            name="name"
                            placeholder="Vorname"
                            value={newStudent.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="surname"
                            placeholder="Nachname"
                            value={newStudent.surname}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile (optional)"
                            value={newStudent.mobile}
                            onChange={handleInputChange}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleAddStudent}>Hinzufügen</button>
                            <button onClick={handleCloseModal}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}

            {isImportModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Datei importieren</h2>
                        <input
                            type="file"
                            accept=".csv, .xlsx"
                            onChange={(e) => setImportFile(e.target.files[0])}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleImportCSV}>Importieren</button>
                            <button onClick={handleImportCloseModal}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}
            {/* 🔹 Buchungs-Pop-up */}
            {isBookingModalOpen && (
                <div className="modal-overlay">
                    <div className="booking-modal">
                        <h2>Buchung hinzufügen</h2>

                        <input type="text" name="title" placeholder="Titel" value={bookingData.title} onChange={handleBookingInputChange} />
                        <input type="number" name="amount" placeholder="Betrag" value={bookingData.amount} onChange={handleBookingInputChange} />
                        <input type="date" name="date" value={bookingData.date} onChange={handleBookingInputChange} />

                        {/* 🔹 Auswahl für Operator */}
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="operator"
                                    value="+"
                                    checked={bookingData.operator === "+"}
                                    onChange={handleBookingInputChange}
                                /> Plus (+)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="operator"
                                    value="-"
                                    checked={bookingData.operator === "-"}
                                    onChange={handleBookingInputChange}
                                /> Minus (-)
                            </label>
                        </div>

                        <h3>Schüler auswählen</h3>
                        <button className="btn-select-all" onClick={handleSelectAll}>
                            {selectedStudents.length === filteredSchueler.length ? 'Alle abwählen' : 'Alle auswählen'}
                        </button>

                        <div className="booking-student-list">
                            {filteredSchueler.map(student => (
                                <label key={student.id} className="booking-student-checkbox">
                                    {student.name} {student.surname}
                                    <input type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() => handleSelectStudent(student.id)}
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="booking-modal-buttons">
                            <button className="btn-save" onClick={handleSaveBooking}>Speichern</button>
                            <button className="btn-cancel" onClick={handleCloseBookingModal}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
