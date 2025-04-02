// components/ImportModal.js
import { useState, useEffect } from 'react';
import '../styles/student.css';

export default function ImportModal({ isOpen, onClose, onImportCSV, onFileChange }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Datei importieren</h2>
                <input
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={onFileChange}
                />
                <div className="modal-buttons">
                    <button onClick={onImportCSV}>Importieren</button>
                    <button onClick={onClose}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}

