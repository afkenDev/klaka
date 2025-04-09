import { useState } from 'react';

export default function LoeschModal({ isOpen, onClose, onDeleteAllSchueler, onDeleteAllBookings, onDeleteAll }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Löschen bestätigen</h2>
                <p>Möchtest du wirklich <strong>alle Schüler inklusive Buchungen</strong> oder <strong>nur die Buchungen</strong> löschen? Diese Aktion kann nicht rückgängig gemacht werden!</p>

                <div className="modal-buttons">
                    <button className="btn-delete" onClick={onDeleteAll}>🔥 Alles löschen (inkl. Klasse)</button>
                    <button className="btn-delete" onClick={onDeleteAllSchueler}>
                        🗑️ Alle Schüler & Buchungen löschen
                    </button>
                    <button className="btn-warning" onClick={onDeleteAllBookings}>
                        🧹 Nur Buchungen löschen
                    </button>

                    <button className="btn-cancel" onClick={onClose}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}
