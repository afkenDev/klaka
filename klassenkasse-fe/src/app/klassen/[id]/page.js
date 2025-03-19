'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../styles/student.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSchuelerMitBalance } from '../../hooks/useSchuelerMitBalance';
import BookingModal from '../../components/BookingModal';
import ImportModal from '../../components/ImportModal';
import StudentCard from '../../components/StudentCard';
import * as XLSX from 'xlsx';

export default function ClassDetail() {
    const { id } = useParams();
    const router = useRouter();
    const { schueler: fetchedSchueler, loading, error } = useSchuelerMitBalance();

    const [state, setState] = useState({
        localSchueler: [],
        searchQuery: '',
        openStudent: null,
        isModalOpen: false,
        newStudent: { name: '', surname: '', mobile: '' },
        isBookingModalOpen: false,
        selectedStudents: [],
        bookingData: { title: '', amount: '', date: new Date().toISOString().split('T')[0], operator: '-' },
        importFile: null,
        isImportModalOpen: false
    });

    if (loading) return <div className="container">Lade Daten...</div>;
    if (error) return <div className="container">Fehler: {error}</div>;

    const allSchueler = [...fetchedSchueler, ...state.localSchueler];

    const toggleDropdown = (studentId) => {
        setState(prevState => ({
            ...prevState,
            openStudent: prevState.openStudent === studentId ? null : studentId
        }));
    };

    const handleModalState = (modalName, isOpen) => {
        setState(prevState => ({
            ...prevState,
            [modalName]: isOpen
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            newStudent: { ...prevState.newStudent, [name]: value }
        }));
    };

    const handleAddStudent = async () => {
        const { name, surname, mobile } = state.newStudent;

        if (!name || !surname) return;

        const email = `${name.toLowerCase()}.${surname.toLowerCase()}@stud.kbw.ch`;
        const studentData = { name, surname, email, mobile, class: String(id) };

        try {
            const response = await fetch('/api/schueler', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Hinzufügen des Schülers');

            setState(prevState => ({
                ...prevState,
                localSchueler: [...prevState.localSchueler, data.data[0]],
                newStudent: { name: '', surname: '', mobile: '' }
            }));
            handleModalState('isModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Schülers:', error);
            alert('Es gab einen Fehler: ' + error.message);
        }
    };

    const handleImportCSV = async () => {
        if (!state.importFile) return;

        const formData = new FormData();
        formData.append('file', state.importFile);

        try {
            const response = await fetch('/api/schueler', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Importieren der Datei');

            if (Array.isArray(data.data)) {
                setState(prevState => ({
                    ...prevState,
                    localSchueler: [...prevState.localSchueler, ...data.data]
                }));
            } else {
                console.warn('Erwartetes Array nicht erhalten:', data.data);
            }

            handleModalState('isImportModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Import:', error);
            alert(error.message || 'Es gab einen Fehler beim Import der Datei.');
        }
    };

    const handleBookingInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            bookingData: { ...prevState.bookingData, [name]: value }
        }));
    };

    const handleSelectStudent = (schuelerId) => {
        setState(prevState => ({
            ...prevState,
            selectedStudents: prevState.selectedStudents.includes(schuelerId)
                ? prevState.selectedStudents.filter(id => id !== schuelerId)
                : [...prevState.selectedStudents, schuelerId]
        }));
    };

    const handleSelectAll = () => {
        setState(prevState => {
            const allSelected = prevState.selectedStudents.length === filteredSchueler.length;
            return {
                ...prevState,
                selectedStudents: allSelected ? [] : filteredSchueler.map(s => s.id),
            };
        });
    };


    const handleSaveBooking = async () => {
        if (!state.bookingData.title || !state.bookingData.amount || state.selectedStudents.length === 0) {
            alert('Bitte alle Felder ausfüllen und mindestens einen Schüler auswählen.');
            return;
        }

        const bookingPayload = {
            name: state.bookingData.title,
            amount: parseFloat(state.bookingData.amount),
            date: state.bookingData.date,
            operator: state.bookingData.operator,
            students: state.selectedStudents,
        };

        try {
            const response = await fetch('/api/buchungen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Speichern der Buchung');

            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.map(s =>
                    state.selectedStudents.includes(s.id)
                        ? { ...s, balance: [...(s.balance || []), data.data[0]] }
                        : s
                )
            }));

            alert('Buchung erfolgreich gespeichert!');
            handleModalState('isBookingModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Speichern der Buchung:', error);
            alert('Es gab einen Fehler: ' + error.message);
        }
    };


    const filteredSchueler = allSchueler
        .filter(schueler => String(schueler.class) === String(id))
        .filter(schueler =>
            `${schueler.name} ${schueler.surname}`.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
        .sort((a, b) => a.surname.toLowerCase().localeCompare(b.surname.toLowerCase()));

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className='title'>Klasse {id}</h1>
                <div className="controls">
                    <button onClick={() => router.push('/klassen')}>← Zurück</button>
                    <input
                        type="text"
                        placeholder="Schüler suchen..."
                        value={state.searchQuery}
                        onChange={(e) => setState(prevState => ({ ...prevState, searchQuery: e.target.value }))}
                        className="search-bar"
                    />
                </div>
                <div className="student-list">
                    {filteredSchueler.length > 0 ? (
                        filteredSchueler.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onToggleDropdown={toggleDropdown}
                                isOpen={state.openStudent === student.id}
                            />
                        ))
                    ) : (
                        <p>Keine Schüler in dieser Klasse.</p>
                    )}
                </div>

                <div className="actions">
                    <button className="btn-orange" onClick={() => handleModalState('isBookingModalOpen', true)}>Buchung hinzufügen</button>
                    <button className="btn-black" onClick={() => handleModalState('isModalOpen', true)}>Schüler:in hinzufügen</button>
                    <button className="btn-black" onClick={() => handleModalState('isImportModalOpen', true)}>Liste importieren</button>
                </div>

                {state.isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Neuen Schüler hinzufügen</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Vorname"
                                value={state.newStudent.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Nachname"
                                value={state.newStudent.surname}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile (optional)"
                                value={state.newStudent.mobile}
                                onChange={handleInputChange}
                            />
                            <div className="modal-buttons">
                                <button onClick={handleAddStudent}>Hinzufügen</button>
                                <button onClick={() => handleModalState('isModalOpen', false)}>Abbrechen</button>
                            </div>
                        </div>
                    </div>
                )}

                {state.isImportModalOpen && (
                    <ImportModal
                        isOpen={state.isImportModalOpen}
                        onClose={() => handleModalState('isImportModalOpen', false)}
                        onImportCSV={handleImportCSV}
                        onFileChange={(e) => setState(prevState => ({ ...prevState, importFile: e.target.files[0] }))}
                    />
                )}
                {state.isBookingModalOpen && (
                    <BookingModal
                        isOpen={state.isBookingModalOpen}
                        onClose={() => handleModalState('isBookingModalOpen', false)}
                        onSave={handleSaveBooking}
                        bookingData={state.bookingData}
                        onInputChange={handleBookingInputChange}
                        students={filteredSchueler}
                        selectedStudents={state.selectedStudents}
                        onSelectStudent={handleSelectStudent}
                        onSelectAll={handleSelectAll}
                    />
                )}
            </div>
            <Footer />
        </>
    );
}
