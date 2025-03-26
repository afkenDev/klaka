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
    //Settings
    const [selectedStudentSettings, setSelectedStudentSettings] = useState(null);
    const [editData, setEditData] = useState({ name: '', surname: '', mobile: '' });

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

    useEffect(() => {
        if (state.localSchueler.length === 0) {
            setState(prevState => ({
                ...prevState,
                localSchueler: fetchedSchueler // Setze den neuen Array direkt
            }));
        }
    }, [fetchedSchueler, state.localSchueler.length]);

    if (loading) return <div className="container">Lade Daten...</div>;
    if (error) return <div className="container">Fehler: {error}</div>;

    const allSchueler = [...state.localSchueler];

    console.log("Alle ", allSchueler)
    console.log("Fetch: ", fetchedSchueler)

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
                ),
                bookingData: { title: '', amount: '', date: new Date().toISOString().split('T')[0], operator: '-' },
                selectedStudents: []
            }));

            alert('Buchung erfolgreich gespeichert!');
            handleModalState('isBookingModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Speichern der Buchung:', error);
            alert('Es gab einen Fehler: ' + error.message);
        }
    };

    //Settings Schüler
    const openSettings = (student) => {
        setSelectedStudentSettings(student);
        setEditData({
            name: student.name,
            surname: student.surname,
            mobile: student.mobile || '',
        });
    };

    const handleInputSettingsChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSettingsSave = async () => {
        if (!selectedStudentSettings) return;

        const updatedStudent = {
            ...editData,
            mail: `${editData.name.toLowerCase()}.${editData.surname.toLowerCase()}@stud.kbw.ch`,
        };

        try {
            const response = await fetch(`/api/schueler/${selectedStudentSettings.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedStudent),
            });

            const data = await response.json();

            if (!response.ok) throw new Error('Fehler beim Speichern der Änderungen');

            console.log(data.data); // Überprüfe, ob die Daten korrekt zurückgegeben werden

            // Aktualisiere den Schüler direkt im Zustand mit den neuen Daten
            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.map(student =>
                    student.id === selectedStudentSettings.id ? { ...student, ...data.data } : student
                ),
            }));

            setSelectedStudentSettings(null); // Schließt das Modal
        } catch (error) {
            console.error(error);
            alert('Fehler beim Aktualisieren der Daten.');
        }
    };


    const handleSettingsDelete = async () => {
        if (!selectedStudentSettings || !confirm(`Schüler ${selectedStudentSettings.name} ${selectedStudentSettings.surname} wirklich löschen?`)) return;

        try {
            const response = await fetch(`/api/schueler/${selectedStudentSettings.id}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Fehler beim Löschen');

            // Entfernt den Schüler aus der lokalen Liste
            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.filter(student => student.id !== selectedStudentSettings.id),
            }));

            setSelectedStudentSettings(null); // Schließt das Modal
        } catch (error) {
            console.error(error);
            alert('Fehler beim Löschen des Schülers.');
        }
    };

    //Einträge
    const handleDeleteTransaction = async (schuelerId, balanceId) => {
        console.log("Lösche Buchung:", { schuelerId, balanceId });

        if (!schuelerId || !balanceId) {
            alert("Fehler: Ungültige IDs!");
            return;
        }

        if (!confirm("Buchung wirklich löschen?")) return;

        try {
            const response = await fetch(`/api/schueler_balance`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schueler_id: schuelerId, balance_id: balanceId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Löschen der Buchung");
            }

            // Entferne die Balance aus der lokalen Liste
            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.map(student =>
                    student.id === schuelerId
                        ? { ...student, balance: student.balance.filter(b => b.id !== balanceId) }
                        : student
                ),
            }));


        } catch (error) {
            console.error("Lösch-Fehler:", error);
            alert(error.message);
        }
    };




    const filteredSchueler = allSchueler
        .filter(schueler => String(schueler.class) === String(id))
        .filter(schueler =>
            `${schueler.name} ${schueler.surname}`.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
        .sort((a, b) => a.surname.toLowerCase().localeCompare(b.surname.toLowerCase()));

    console.log(state.localSchueler)
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
                                onOpenSettings={openSettings}
                                onDeleteTransaction={handleDeleteTransaction}
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
                {selectedStudentSettings && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Schüler bearbeiten</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Vorname"
                                value={editData.name}
                                onChange={handleInputSettingsChange}
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Nachname"
                                value={editData.surname}
                                onChange={handleInputSettingsChange}
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile (optional)"
                                value={editData.mobile}
                                onChange={handleInputSettingsChange}
                            />
                            <p><strong>Email:</strong> {`${editData.name.toLowerCase()}.${editData.surname.toLowerCase()}@stud.kbw.ch`}</p>
                            <div className="modal-buttons">
                                <button onClick={handleSettingsSave}>Speichern</button>
                                <button className="btn-delete" onClick={handleSettingsDelete}>Löschen</button>
                                <button onClick={() => setSelectedStudentSettings(null)}>Abbrechen</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </>
    );
}
