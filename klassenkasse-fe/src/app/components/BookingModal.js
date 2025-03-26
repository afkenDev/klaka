import { useState, useEffect } from 'react';
import '../styles/student.css';

// components/BookingModal.js
export default function BookingModal({ isOpen, onClose, onSave, bookingData, onInputChange, students, selectedStudents, onSelectStudent, onSelectAll }) {
    if (!isOpen) return null;

    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-'); // ISO-Format in dd.mm.yyyy umwandeln
        return `${day}.${month}.${year}`;
    };

    const formatDateForStorage = (displayDate) => {
        const [day, month, year] = displayDate.split('.');
        return `${year}-${month}-${day}`; // Zurück in yyyy-MM-dd für das Backend
    };



    return (
        <div className="modal-overlay">
            <div className="booking-modal">
                <h2>Buchung hinzufügen</h2>

                <input type="text" name="title" placeholder="Titel" value={bookingData.title} onChange={onInputChange} />
                <input type="number" name="amount" placeholder="Betrag" value={bookingData.amount} onChange={onInputChange} />
                <input
                    type="date"
                    name="date"
                    value={formatDateForStorage(bookingData.date)} // Backend benötigt yyyy-MM-dd
                    onChange={(e) => onInputChange({
                        target: { name: 'date', value: formatDateForDisplay(e.target.value) } // Anzeige als dd.mm.yyyy
                    })}
                />

                <div>
                    <label>
                        <input
                            type="radio"
                            name="operator"
                            value="+"
                            checked={bookingData.operator === "+"}
                            onChange={onInputChange}
                        /> Plus (+)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="operator"
                            value="-"
                            checked={bookingData.operator === "-"}
                            onChange={onInputChange}
                        /> Minus (-)
                    </label>
                </div>

                <h3>Schüler auswählen</h3>
                <button className="btn-select-all" onClick={onSelectAll}>
                    {selectedStudents.length === students.length ? 'Alle abwählen' : 'Alle auswählen'}
                </button>


                <div className="booking-student-list">
                    {students.map(student => (
                        <label key={student.id} className="booking-student-checkbox">
                            {student.name} {student.surname}
                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(student.id)}
                                onChange={() => onSelectStudent(student.id)}
                            />
                        </label>
                    ))}
                </div>

                <div className="booking-modal-buttons">
                    <button className="btn-save" onClick={onSave}>Speichern</button>
                    <button className="btn-cancel" onClick={onClose}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}

