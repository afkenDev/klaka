import { useState, useEffect } from 'react';
import '../styles/student.css';

// components/BookingModal.js
export default function BookingModal({ isOpen, onClose, onSave, bookingData, onInputChange, students, selectedStudents, onSelectStudent, onSelectAll }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="booking-modal">
                <h2>Buchung hinzufügen</h2>

                <input type="text" name="title" placeholder="Titel" value={bookingData.title} onChange={onInputChange} />
                <input type="number" name="amount" placeholder="Betrag" value={bookingData.amount} onChange={onInputChange} />
                <input type="date" name="date" value={bookingData.date} onChange={onInputChange} />

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

