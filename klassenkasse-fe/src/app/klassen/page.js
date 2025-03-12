'use client';

import { useState } from 'react';
import '../styles/classview.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';

const exampleClasses = [
    { id: 1, className: '3I', teacher: 'M. Veselcic', volume: 4700, lastActivity: 'vor 2 Tagen', students: 15, color: 'blue' },
    { id: 2, className: '3I', teacher: 'M. Veselcic', volume: 4700, lastActivity: 'vor 2 Tagen', students: 15, color: 'teal' },
    { id: 3, className: '2I', teacher: 'S. Nemet', volume: 8700, lastActivity: 'vor 4 Wochen', students: 9, color: 'teal-dark' },
    { id: 4, className: '3eW', teacher: 'M. KA', volume: 4700, lastActivity: 'vor 2 Tagen', students: 20, color: 'orange' },
];

export default function ClassOverview() {
    const [classes, setClasses] = useState(exampleClasses);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClass, setNewClass] = useState({
        className: '',
        teacher: '',
        color: 'blue'
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewClass({ className: '', teacher: '', color: 'blue' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClass((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const handleAddClass = () => {
        if (!newClass.className || !newClass.teacher) return;
        setClasses([...classes, {
            id: classes.length + 1,
            className: newClass.className,
            teacher: newClass.teacher,
            color: newClass.color,
            volume: 0,
            lastActivity: 'Neu',
            students: 0
        }]);
        handleCloseModal();
    };

    const router = useRouter();

    const handleCardClick = (id) => {
        router.push(`/klassen/${id}`);
    };

    // Filtere Klassen nach Suchbegriff
    const filteredClasses = classes.filter(classData =>
        classData.className.toLowerCase().includes(searchQuery) ||
        classData.teacher.toLowerCase().includes(searchQuery)
    );

    return (
        <>
            <Navbar />
            <div className="container">
                <h1 className="title">Klassenübersicht</h1>

                {/* Suchfeld */}
                <input
                    type="text"
                    placeholder="Klasse oder Lehrer suchen..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-bar"
                />

                <div className="grid">
                    {filteredClasses.map((classData) => (
                        <div
                            key={classData.id}
                            className={`card ${classData.color}`}
                            onClick={() => handleCardClick(classData.id)}
                        >
                            <div className="header">
                                <span className="bold">{classData.className}</span>
                                <span>{classData.teacher}</span>
                            </div>
                            <div className="info">
                                <div className="students">
                                    <span className="icon">👥</span>
                                    <span>{classData.students}</span>
                                </div>
                                <div className="volume">Volumen: {new Intl.NumberFormat('de-CH').format(classData.volume)} CHF</div>
                            </div>
                            <p className="activity">Letzte Aktivität: {classData.lastActivity}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />

            {/* Plus Button */}
            <button className="add-button" onClick={handleOpenModal}>+</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Neue Klasse hinzufügen</h2>
                        <input
                            type="text"
                            name="className"
                            placeholder="Klassenname"
                            value={newClass.className}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="teacher"
                            placeholder="Klassenlehrer"
                            value={newClass.teacher}
                            onChange={handleInputChange}
                        />
                        <select name="color" value={newClass.color} onChange={handleInputChange}>
                            <option value="blue">Blau</option>
                            <option value="teal">Türkis</option>
                            <option value="teal-dark">Dunkel-Türkis</option>
                            <option value="orange">Orange</option>
                        </select>
                        <div className="modal-buttons">
                            <button onClick={handleAddClass}>Hinzufügen</button>
                            <button onClick={handleCloseModal}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
