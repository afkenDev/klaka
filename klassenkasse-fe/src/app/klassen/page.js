'use client'; // Enable client-side execution

import { useState } from 'react';
import '../styles/classview.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { useKlassen } from '../hooks/useKlassen';
import { useSchuelerMitBalance } from '../hooks/useSchuelerMitBalance'; // Für Schülerdaten mit Balance

export default function KlassenPage() {
  const router = useRouter();
  const { klassen: fetchedKlassen, loading, error } = useKlassen();
  const { schueler: fetchedSchueler, loading: loadingSchueler, error: errorSchueler } = useSchuelerMitBalance();
  const [localKlassen, setLocalKlassen] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    klassenname: '',
    lehrer: '',
    vorname: '',
    nachname: '',
    color: 'blue'
  });

  const [selectedClassId, setSelectedClassId] = useState(null); // Neuer Zustand für die ausgewählte Klasse

  const allKlassen = [...fetchedKlassen, ...localKlassen];

  if (loading || loadingSchueler) return <div className="container">Lade Daten...</div>;
  if (error || errorSchueler) return <div className="container">Fehler: {error || errorSchueler}</div>;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClass({ id: '', lehrer: '', color: 'blue' });
  };

  // handleInputChange-Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  //Klasse hinzufügen
  const handleAddClass = async () => {
    if (!newClass.klassenname) return;

    try {
      // Sende POST-Request an die API-Route
      const response = await fetch('/api/klassen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });

      console.log('Response:', response);

      if (!response.ok) {
        throw new Error('Fehler beim Hinzufügen der Klasse');
      }

      const data = await response.json();
      setLocalKlassen([...localKlassen, data[0]]);
      handleCloseModal();

    } catch (error) {
      console.error(error);
    }
  };


  // Filtere Klassen basierend auf der Suchanfrage (id oder lehrer)
  const filteredClasses = allKlassen.filter(klasse =>
    String(klasse.klassenname).toLowerCase().includes(searchQuery) ||
    String(klasse.vorname).toLowerCase().includes(searchQuery) ||
    String(klasse.nachname).toLowerCase().includes(searchQuery)
  );

  // Filtern der Schüler basierend auf der ausgewählten Klasse
  const filteredClassesWithStudents = selectedClassId
    ? filteredClasses.filter(klasse => klasse.id === selectedClassId)
    : filteredClasses;

  // Berechnung der Anzahl an Schülern und Gesamtvolumen
  const getClassStudentCount = (klasseId) => {
    const anzahlSchueler = fetchedSchueler.filter(student => student.class === klasseId).length;
    return anzahlSchueler;
  };


  const getClassVolume = (klasseId) => {
    const studentsInClass = fetchedSchueler.filter(student => String(student.class) === String(klasseId));
    return studentsInClass.reduce((total, student) => {
      const studentBalance = student.balance || [];
      const studentVolume = studentBalance.reduce((sum, b) =>
        b.operator === '-' ? sum - b.amount : sum + b.amount, 0);
      return total + studentVolume;
    }, 0);
  };

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
          {filteredClassesWithStudents.map((klasse) => (
            <div
              key={klasse.id}
              className="card"
              style={{ backgroundColor: klasse.color }} // Dynamische Hintergrundfarbe basierend auf dem `color`-Feld
              onClick={() => {
                setSelectedClassId(klasse.klassenname); // Speichern der ausgewählten Klasse
                router.push(`/klassen/${klasse.klassenname}`);
              }}
            >
              <div className="header">
                <span className="bold">{klasse.klassenname}</span>
                <span>{klasse.vorname + " " + klasse.nachname}</span>
              </div>
              <div className="info">
                <div className="students">
                  <span className="icon">👥</span>
                  <span>{getClassStudentCount(klasse.klassenname)}</span> {/* Anzeige der Schüleranzahl */}
                </div>
                <div className="volume">
                  Volumen: {new Intl.NumberFormat('de-CH').format(getClassVolume(klasse.klassenname))} CHF {/* Gesamtvolumen */}
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
              </p>
            </div>
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
              name="klassenname"
              placeholder="Klassenname"
              value={newClass.klassenname}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="nachname"
              placeholder="Nachname Klassenlehrer"
              value={newClass.nachname}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vorname"
              placeholder="Vorname Klassenlehrer"
              value={newClass.vorname}
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
