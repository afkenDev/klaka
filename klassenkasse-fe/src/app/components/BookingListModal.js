import { useState, useEffect } from 'react';

export default function BookingListModal({ isOpen, onClose, bookings, onEdit, onDelete }) {
    const [editingBookingId, setEditingBookingId] = useState(null);
    const [tempBooking, setTempBooking] = useState({});

    // Reset the states when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setEditingBookingId(null);
            setTempBooking({});
        }
    }, [isOpen]); // useEffect will run every time `isOpen` changes

    if (!isOpen) return null;

    const handleInputChange = (e, field) => {
        setTempBooking(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleEditClick = (booking) => {
        setEditingBookingId(booking.id);
        setTempBooking({
            ...booking,
            date: formatDateForStorage(booking.date), // Formatierung für das Date-Input (yyyy-MM-dd)
            operator: booking.operator // Speichern des Operators für die Bearbeitung
        });
    };

    const handleSaveClick = () => {
        onEdit({
            ...tempBooking,
            date: formatDateForDisplay(tempBooking.date), // Speichern im Format dd.mm.yyyy
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
                                                {/* Dropdown für den Operator */}
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
                                                value={tempBooking.date || ''} // Sicherstellen, dass ein leerer Wert gesetzt wird, falls undefined
                                                onChange={(e) => handleInputChange(e, "date")}
                                            />
                                        ) : (
                                            booking.date // Anzeige im Format dd.mm.yyyy
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
