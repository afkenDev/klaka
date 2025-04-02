import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../styles/student.css';

export default function ExportModal({ isOpen, onClose, students, selectedStudents, onSelectStudent, onSelectAll, onGeneratePDF }) {

    /*const generatePDF = async () => {
        if (selectedStudents.length === 0) {
            alert('Bitte mindestens einen Schüler auswählen.');
            return;
        }

        for (const student of students.filter((s) => selectedStudents.includes(s.id))) {
            const doc = new jsPDF();
            doc.text(`Buchungen für ${student.name} ${student.surname}`, 10, 10);

            // Tabellenkopf
            const tableHeaders = [['Name', 'Amount', 'Date']];
            const tableData = student.balance.map((entry) => [
                entry.name,
                `${entry.amount}€`,
                entry.date,
            ]);

            doc.autoTable({
                head: tableHeaders,
                body: tableData,
                startY: 20,
            });

            // Gesamtsumme berechnen
            const total = student.balance.reduce((sum, entry) => sum + entry.amount, 0);
            doc.text(`Gesamt: ${total.toFixed(2)}€`, 10, doc.autoTable.previous.finalY + 10);

            doc.save(`Buchungen_${student.name}_${student.surname}.pdf`);
        }
    };*/

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
