'use client'; // Enable client-side execution

import { useState, useEffect } from 'react';
import '../styles/classview.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { useKlassen } from '../hooks/useKlassen';

export default function KlassenPage() {
  const router = useRouter();
  const { klassen: fetchedKlassen, lehrer, loading, error } = useKlassen();
  const [localKlassen, setLocalKlassen] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    id: '',
    lehrer: '',
    color: 'blue'
  });

  const allKlassen = [...fetchedKlassen, ...localKlassen];

  if (loading) return <div className="container">Lade Daten...</div>;
  if (error) return <div className="container">Fehler: {error}</div>;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClass({ id: '', lehrer: '', color: 'blue' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClass = () => {
    if (!newClass.id || !newClass.lehrer) return;
    setLocalKlassen([...localKlassen, {
      ...newClass,
      lastActivity: 'Neu',
      volume: 0,
      students: 0
    }]);
    handleCloseModal();
  };

  // Filtere Klassen basierend auf der Suchanfrage (id oder lehrer)
  const filteredClasses = allKlassen.filter(klasse =>
    String(klasse.id).toLowerCase().includes(searchQuery) ||
    klasse.lehrer.toLowerCase().includes(searchQuery)
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="title">Klassenübersicht</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Klasse oder Lehrer suchen..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
        </div>

        <div className="grid">
          {filteredClasses.map((klasse) => (
            <div
              key={klasse.id}
              className="card"
              style={{ backgroundColor: klasse.color }} // Dynamische Hintergrundfarbe basierend auf dem `color`-Feld
              onClick={() => router.push(`/klassen/${klasse.id}`)}
            >
              <div className="header">
                <span className="bold">{klasse.klassenname}</span>
                <span>{klasse.vorname + " " + klasse.nachname}</span>
              </div>
              <div className="info">
                <div className="students">
                  <span className="icon">👥</span>
                  <span>{klasse.students || 0}</span>
                </div>
                <div className="volume">
                  Volumen: {new Intl.NumberFormat('de-CH').format(klasse.volume || 0)} CHF
                </div>
              </div>
              <p className="activity">
  <strong>Letzte Aktivität: </strong> 
  {klasse.lastActivity ? new Date(klasse.lastActivity).toLocaleString('de-CH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : 'Keine Aktivität verfügbar'}
</p>            </div>
          ))}
        </div>

      </div>
      <Footer />

      <button className="add-button" onClick={handleOpenModal}>+</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Neue Klasse hinzufügen</h2>
            <input
              type="text"
              name="id"
              placeholder="Klassenname"
              value={newClass.id}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lehrer"
              placeholder="Klassenlehrer"
              value={newClass.lehrer}
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
