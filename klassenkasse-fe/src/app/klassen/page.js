'use client';
import { useState, useEffect } from 'react';
import '../styles/classview.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { useKlassen } from '../hooks/useKlassen';
import { useSchuelerMitBalance } from '../hooks/useSchuelerMitBalance';
import { supabase } from '../lib/supabaseClient';

export default function KlassenPage() {
  const router = useRouter();

  const [user, setUser] = useState(null); // ✅ User wird im State gespeichert
  const [localKlassen, setLocalKlassen] = useState([]);
  const [klassenUpdated, setKlassenUpdated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    klassenname: '',
    vorname: '',
    nachname: '',
    color: 'blue'
  });
  const [selectedClassId, setSelectedClassId] = useState(null);

  const { klassen: fetchedKlassen, loading, error } = useKlassen();
  const { schueler: fetchedSchueler, loading: loadingSchueler, error: errorSchueler } = useSchuelerMitBalance();

  // ✅ User beim Laden holen und speichern
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      setUser(user); // ✅ im State speichern
    };

    checkUser();
  }, [router]);

  if (loading || loadingSchueler) return <div className="container">Lade Daten...</div>;
  if (error || errorSchueler) return <div className="container">Fehler: {error || errorSchueler}</div>;

  const allKlassen = [...fetchedKlassen, ...localKlassen];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewClass({ klassenname: '', vorname: '', nachname: '', color: 'blue' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Klasse hinzufügen mit userId aus State
  const handleAddClass = async () => {
    if (!user) {
      alert("User nicht gefunden. Bitte erneut einloggen.");
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      alert("Session nicht gefunden. Bitte erneut einloggen.");
      return;
    }

    try {
      const response = await fetch('/api/klassen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newClass),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      console.log("Erstellt:", result.data);
      setLocalKlassen((prev) => [...prev, result.data]);
      handleCloseModal();
    } catch (err) {
      console.error("Fehler:", err.message);
      alert("Fehler: " + err.message);
    }
  };


  const filteredClasses = allKlassen.filter(klasse =>
    String(klasse.klassenname).toLowerCase().includes(searchQuery) ||
    String(klasse.vorname).toLowerCase().includes(searchQuery) ||
    String(klasse.nachname).toLowerCase().includes(searchQuery)
  );

  const filteredClassesWithStudents = selectedClassId
    ? filteredClasses.filter(klasse => klasse.id === selectedClassId)
    : filteredClasses;

  const getClassStudentCount = (klasseId) => {
    return fetchedSchueler.filter(student => String(student.class) === String(klasseId)).length;
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
              style={{ backgroundColor: klasse.color }}
              onClick={() => {
                setSelectedClassId(klasse.klassenname);
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
                  <span>{getClassStudentCount(klasse.id)}</span>
                </div>
                <div className="volume">
                  Volumen: {new Intl.NumberFormat('de-CH').format(getClassVolume(klasse.id))} CHF
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
              value={newClass.klassenname || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="nachname"
              placeholder="Nachname Klassenlehrer"
              value={newClass.nachname || ''}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vorname"
              placeholder="Vorname Klassenlehrer"
              value={newClass.vorname || ''}
              onChange={handleInputChange}
            />
            <select name="color" value={newClass.color} onChange={handleInputChange}>
              <option value="blue">Blau</option>
              <option value="teal">Türkis</option>
              <option value="teal-dark">Dunkel-Türkis</option>
              <option value="orange">Orange</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleAddClass} disabled={!user}>Hinzufügen</button>
              <button onClick={handleCloseModal}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
