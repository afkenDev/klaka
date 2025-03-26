import { useState, useEffect } from 'react';
import '../styles/student.css';

export default function BookingListModal({ isOpen, onClose, bookings, onEdit, onDelete }) {
    if (!isOpen) return null;

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
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.name}</td>
                                    <td>
                                        {booking.operator === '-' ? '-' : '+'}
                                        {isNaN(booking.amount) ? '0.00' : parseFloat(booking.amount).toFixed(2)} Fr.
                                    </td>
                                    <td>{booking.date}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => onEdit(booking)}>Bearbeiten</button>
                                        <button className="btn-delete" onClick={() => onDelete(booking.id)}>Löschen</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ul>

                </ul>
                <button className="btn-cancel" onClick={onClose}>Schließen</button>
            </div>
        </div>
    );
};
