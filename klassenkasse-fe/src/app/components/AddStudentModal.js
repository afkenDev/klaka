import '../styles/student.css';

export default function AddStudentModal({ isOpen, handleClose, newStudent, handleInputChange, handleAddStudent }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Neuen Schüler hinzufügen</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Vorname"
                    value={newStudent.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="surname"
                    placeholder="Nachname"
                    value={newStudent.surname}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile (optional)"
                    value={newStudent.mobile}
                    onChange={handleInputChange}
                />
                <div className="modal-buttons">
                    <button onClick={handleAddStudent}>Hinzufügen</button>
                    <button onClick={handleCloseModal}>Abbrechen</button>
                </div>
            </div>
        </div>
    );
}
