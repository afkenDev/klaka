import { useState, useEffect } from 'react';

// components/BookingModal.js
export default function BookingModal({
    isOpen,
    onClose,
    onSave,
    bookingData,
    onInputChange,
    students,
    selectedStudents,
    onSelectStudent,
    onSelectAll
}) {
    if (!isOpen) return null;

    const subjects = ['Deutsch', 'Englisch', 'Französisch', 'Mathematik', 'Wirtschaft&Recht', 'Rechnungswesen', 'Chemie', 'Biologie', 'Physik', 'Naturwissenschaften', 'Sport', 'Informatik', 'Geschichte', 'Geographie', 'Bildnerisches Gestalten', 'Musik', 'Sonstiges'];
    const [filteredSubjects, setFilteredSubjects] = useState(subjects);

    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-'); // ISO-Format (yyyy-MM-dd)
        return `${day}.${month}.${year}`; // Umwandlung in dd.mm.yyyy
    };

    const formatDateForStorage = (displayDate) => {
        const [day, month, year] = displayDate.split('.'); // dd.mm.yyyy
        return `${year}-${month}-${day}`; // Umwandlung in yyyy-MM-dd
    };

    const handleSubjectChange = (e) => {
        const inputValue = e.target.value;
        onInputChange({ target: { name: 'subject', value: inputValue } });

        // Filter die Fächer basierend auf der Eingabe
        if (inputValue) {
            setFilteredSubjects(subjects.filter(subject => subject.toLowerCase().includes(inputValue.toLowerCase())));
        } else {
            setFilteredSubjects(subjects); // Wenn das Eingabefeld leer ist, zeige alle an
        }
    };

    return (
        <div className="modal-overlay">
            <div className="booking-modal">
                <h2>Buchung hinzufügen</h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Titel"
                    value={bookingData.title || ''}
                    onChange={onInputChange}
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Betrag"
                    value={bookingData.amount || ''}
                    min="0"
                    step="0.01"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                            onInputChange({ target: { name: "amount", value: "" } });
                            return;
                        }

                        const numericValue = parseFloat(value);
                        if (!isNaN(numericValue) && numericValue >= 0) {
                            onInputChange({ target: { name: "amount", value: value } });
                        }
                    }}
                />

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
                        /> Addieren (+)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="operator"
                            value="-"
                            checked={bookingData.operator === "-"}
                            onChange={onInputChange}
                        /> Subtrahieren (-)
                    </label>
                </div>

                <h3>Fach auswählen</h3>
                <input
                    type="text"
                    name="subject"
                    placeholder="Fach eingeben und sonst 'Sonstiges"
                    value={bookingData.subject || ''}
                    onChange={handleSubjectChange}
                    list="subjects-list"
                />
                <datalist id="subjects-list">
                    {filteredSubjects.map(subject => (
                        <option key={subject} value={subject} />
                    ))}
                </datalist>

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
                    <button
                        className="btn-save"
                        onClick={() => {
                            if (!subjects.includes(bookingData.subject)) {
                                alert(`"${bookingData.subject}" ist kein gültiges Fach.`);
                                return;
                            }
                            onSave(); // Speichern der Buchung
                        }}
                    >
                        Speichern
                    </button>
                    <button className="btn-cancel" onClick={onClose}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}

