import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/student.css';

export default function ExportModal({ isOpen, onClose, students, selectedStudents, onSelectStudent, onSelectAll, onGeneratePDF }) {


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="export-modal">
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

                <div className="export-modal-buttons">
                    <button className="btn-export" onClick={() => onGeneratePDF(students)}>Exportieren</button>
                    <button className="btn-cancel" onClick={onClose}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}
