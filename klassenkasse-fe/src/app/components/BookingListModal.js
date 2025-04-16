import { useState, useEffect } from 'react';
import '../styles/student.css';

export default function BookingListModal({ isOpen, onClose, bookings, onEdit, onDelete }) {
    const subjects = ['Deutsch', 'Englisch', 'Französisch', 'Mathematik', 'Wirtschaft&Recht', 'Rechnungswesen', 'Chemie', 'Biologie', 'Physik', 'Naturwissenschaften', 'Sport', 'Informatik', 'Geschichte', 'Geographie', 'Bildnerisches Gestalten', 'Musik', 'Sonstiges'];

    const [editingBookingId, setEditingBookingId] = useState(null);
    const [tempBooking, setTempBooking] = useState({});
    const [filteredSubjects, setFilteredSubjects] = useState(subjects);

    useEffect(() => {
        if (!isOpen) {
            setEditingBookingId(null);
            setTempBooking({});
        }
    }, [isOpen]);

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setTempBooking(prev => {
            const updatedBooking = { ...prev, [field]: value };

            // Wenn der Operator auf "+" gesetzt wird, setze das Fach auf "-"
            if (field === 'operator') {
                if (value === "+") {
                    updatedBooking.fach = '-'; // "+" → Fach auf "-" setzen
                } else if (value === "-") {
                    updatedBooking.fach = ''; // "-" → Fach leeren
                }
            }

            return updatedBooking;
        });

        if (field === 'fach') {
            if (value) {
                setFilteredSubjects(subjects.filter(subject =>
                    subject.toLowerCase().includes(value.toLowerCase())
                ));
            } else {
                setFilteredSubjects(subjects);
            }
        }
    };

    const handleEditClick = (booking) => {
        setEditingBookingId(booking.id);
        setTempBooking({
            ...booking,
            date: formatDateForStorage(booking.date), // Formatierung für das Date-Input (yyyy-MM-dd)
            operator: booking.operator, // Speichern des Operators für die Bearbeitung
            fach: booking.fach || ''
        });
    };

    const handleSaveClick = () => {
        // Nur gültige Fächer, außer wenn der Operator "+" ist und das Fach '-'
        if (!(tempBooking.operator === "+" && tempBooking.fach === '-') && !subjects.includes(tempBooking.fach)) {
            alert(`"${tempBooking.fach}" ist kein gültiges Fach.`);
            return;
        }

        onEdit({
            ...tempBooking,
            date: formatDateForDisplay(tempBooking.date),
        });
        setEditingBookingId(null);
    };


    // Konvertiert "dd.mm.yyyy" -> "yyyy-mm-dd" für das Date-Input
    const formatDateForStorage = (displayDate) => {
        if (!displayDate) return ''; // Rückgabe einer leeren Zeichenkette, falls das Datum nicht vorhanden ist
        const [day, month, year] = displayDate.split('.'); // dd.mm.yyyy
        return `${year}-${month}-${day}`; // Umwandlung in yyyy-MM-dd
    };

    // Konvertiert "yyyy-mm-dd" -> "dd.mm.yyyy" für die Anzeige
    const formatDateForDisplay = (isoDate) => {
        if (!isoDate) return ''; // Rückgabe einer leeren Zeichenkette, falls das Datum nicht vorhanden ist
        const [year, month, day] = isoDate.split('-'); // yyyy-mm-dd
        return `${day}.${month}.${year}`; // Umwandlung in dd.mm.yyyy
    };

    const sortedBookings = [...bookings].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('.');
        const [dayB, monthB, yearB] = b.date.split('.');
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        if (dateA.getTime() === dateB.getTime()) {
            return b.id - a.id; // Höhere ID zuerst bei gleichem Datum
        }

        return dateB - dateA; // Neueste zuerst
    });

    console.log("tempBooking: ", tempBooking);

    return (
        <div className="modal-overlay">
            <div className="booking-modal">
                <h2>Alle Buchungen</h2>
                <div className='transaction-list'>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Betrag</th>
                                <th>Datum</th>
                                <th>Fach</th>
                                <th>Bearbeitung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        {editingBookingId === booking.id ? (
                                            <input
                                                type="text"
                                                value={tempBooking.name}
                                                onChange={(e) => handleInputChange(e, "name")}
                                            />
                                        ) : (
                                            booking.name
                                        )}
                                    </td>

                                    <td>
                                        {editingBookingId === booking.id ? (
                                            <>
                                                <select
                                                    value={tempBooking.operator}
                                                    onChange={(e) => handleInputChange(e, "operator")}
                                                >
                                                    <option value="+">+</option>
                                                    <option value="-">-</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    value={tempBooking.amount}
                                                    onChange={(e) => handleInputChange(e, "amount")}
                                                />
                                            </>
                                        ) : (
                                            `${booking.operator === '-' ? '-' : '+'}${parseFloat(booking.amount).toFixed(2)} Fr.`
                                        )}
                                    </td>

                                    <td>
                                        {editingBookingId === booking.id ? (
                                            <input
                                                type="date"
                                                value={tempBooking.date || ''}
                                                onChange={(e) => handleInputChange(e, "date")}
                                            />
                                        ) : (
                                            booking.date
                                        )}
                                    </td>

                                    <td>
                                        {editingBookingId === booking.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={tempBooking.fach || ''}
                                                    onChange={(e) => handleInputChange(e, "fach")}
                                                    list="subjects-list"
                                                    readOnly={tempBooking.operator === '+'} // Wenn der Operator "+" ist, wird das Fach nicht änderbar
                                                />
                                                <datalist id="subjects-list">
                                                    {filteredSubjects.map(subject => (
                                                        <option key={subject} value={subject} />
                                                    ))}
                                                </datalist>
                                            </>
                                        ) : (
                                            booking.fach || "-"
                                        )}
                                    </td>

                                    <td>
                                        {editingBookingId === booking.id ? (
                                            <>
                                                <button className="btn-save" onClick={handleSaveClick}>Speichern</button>
                                                <button className="btn-cancel" onClick={() => setEditingBookingId(null)}>Abbrechen</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn-edit" onClick={() => handleEditClick(booking)}>Bearbeiten</button>
                                                <button className="btn-delete" onClick={() => onDelete(booking.id)}>Löschen</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                <button className="btn-cancel" onClick={() => {
                    onClose();
                    setEditingBookingId(null);
                    setTempBooking({}); // Zurücksetzen der States
                }}>Schließen</button>
            </div>
        </div>
    );
};
