'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '../../styles/student.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useSchuelerMitBalance } from '../../hooks/useSchuelerMitBalance';
import { useBalance } from '../../hooks/useBalance';
import { useKlassenName } from '../../hooks/useKlassenName'
import BookingModal from '../../components/BookingModal';
import ImportModal from '../../components/ImportModal';
import StudentCard from '../../components/StudentCard';
import ExportModal from '../../components/ExportModal';
import BookingListModal from '../../components/BookingListModal';
import LoeschModal from '../../components/LoeschModal';
import { supabase } from '../../lib/supabaseClient.js';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import Image from "next/image";


export default function ClassDetail() {
    const { id } = useParams();
    const router = useRouter();
    const classId = id;
    console.log("classid, ", classId)

    const [user, setUser] = useState(null);
    console.log("test, ", id)
    const { klassenname, KlassenLoading, KlassenError } = useKlassenName(id);
    console.log("Klassenname, ", klassenname);

    const { schueler: fetchedSchueler, loading, error } = useSchuelerMitBalance();
    //Settings
    const [selectedStudentSettings, setSelectedStudentSettings] = useState(null);
    const [editData, setEditData] = useState({ name: '', surname: '', mobile: '' });

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isBookingListModalOpen, setIsBookingListModalOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const { balance: fetchedBalance, loadingBalance, errorBalance } = useBalance(classId);
    const [localBalance, setLocalBalance] = useState([]);
    const allBalance = [...fetchedBalance, ...localBalance];

    const getFormattedToday = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0'); // Führende 0 hinzufügen
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Januar = 0, daher +1
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const [state, setState] = useState({
        localSchueler: [],
        searchQuery: '',
        openStudent: null,
        isModalOpen: false,
        newStudent: { name: '', surname: '', mobile: '' },
        isBookingModalOpen: false,
        selectedStudents: [],
        bookingData: { title: '', amount: '', date: getFormattedToday(), operator: '-', subject: '' },
        importFile: null,
        isImportModalOpen: false,
        bookings: [],
        isBookingListModalOpen: false,
    });
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



    useEffect(() => {
        if (state.localSchueler.length === 0) {
            setState(prevState => ({
                ...prevState,
                localSchueler: fetchedSchueler // Setze den neuen Array direkt
            }));
        }
    }, [fetchedSchueler, state.localSchueler.length]);

    if (KlassenLoading) return <div>Lade Klassendaten...</div>;
    if (KlassenError) return <div>Fehler: {error}</div>;
    if (loading) return <div className="container">Lade Daten...</div>;
    if (error) return <div className="container">Fehler: {error}</div>;

    const allSchueler = [...state.localSchueler];

    console.log("Alle ", allSchueler)
    console.log("Fetch: ", fetchedSchueler)

    const toggleDropdown = (studentId) => {
        setState(prevState => ({
            ...prevState,
            openStudent: prevState.openStudent === studentId ? null : studentId
        }));
    };

    const handleModalState = (modalName, isOpen) => {
        setState(prevState => ({
            ...prevState,
            [modalName]: isOpen,
            ...(modalName === 'isModalOpen' && !isOpen ? { newStudent: { name: '', surname: '', mobile: '' } } : {}),
            ...(modalName === 'isBookingModalOpen' && !isOpen
                ? { bookingData: { title: '', amount: '', date: getFormattedToday(), operator: '-' }, selectedStudents: [] }
                : {})
        }));
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            newStudent: { ...prevState.newStudent, [name]: value }
        }));
    };

    const handleAddStudent = async () => {
        const { name, surname, mobile } = state.newStudent;

        if (!name || !surname) return;

        const email = `${name.toLowerCase()}.${surname.toLowerCase()}@stud.kbw.ch`;
        const studentData = { name, surname, email, mobile, class: classId };

        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            alert("Session nicht gefunden. Bitte erneut einloggen.");
            return;
        }

        try {
            const response = await fetch('/api/schueler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(studentData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Hinzufügen des Schülers');

            setState(prevState => ({
                ...prevState,
                localSchueler: [...prevState.localSchueler, data.data[0]],
                newStudent: { name: '', surname: '', mobile: '' }
            }));
            handleModalState('isModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Schülers:', error);
            alert('Es gab einen Fehler: ' + error.message);
        }
    };


    const handleImportCSV = async () => {
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

        if (!state.importFile) return;

        const formData = new FormData();
        formData.append('file', state.importFile);
        formData.append('classId', classId);

        try {
            const response = await fetch('/api/schueler', {
                method: 'POST', body: formData,
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Importieren der Datei');

            if (Array.isArray(data.data)) {
                setState(prevState => ({
                    ...prevState,
                    localSchueler: [...prevState.localSchueler, ...data.data]
                }));
            } else {
                console.warn('Erwartetes Array nicht erhalten:', data.data);
            }

            handleModalState('isImportModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Import:', error);
            alert(error.message || 'Es gab einen Fehler beim Import der Datei.');
        }
    };


    const handleBookingInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            bookingData: { ...prevState.bookingData, [name]: value }
        }));
    };

    const handleSelectStudent = (schuelerId) => {
        setState(prevState => ({
            ...prevState,
            selectedStudents: prevState.selectedStudents.includes(schuelerId)
                ? prevState.selectedStudents.filter(id => id !== schuelerId)
                : [...prevState.selectedStudents, schuelerId]
        }));
    };

    const handleSelectAll = () => {
        setState(prevState => {
            const allSelected = prevState.selectedStudents.length === filteredSchueler.length;
            return {
                ...prevState,
                selectedStudents: allSelected ? [] : filteredSchueler.map(s => s.id),
            };
        });
    };

    const formatDateForStorage = (displayDate) => {
        const [day, month, year] = displayDate.split('.');
        return `${day}.${month}.${year}`; // Zurück in yyyy-MM-dd für das Backend
    };

    const handleSaveBooking = async () => {
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


        if (!state.bookingData.title || !state.bookingData.amount || !state.bookingData.subject || state.selectedStudents.length === 0) {
            alert('Bitte alle Felder ausfüllen und mindestens einen Schüler auswählen.');
            return;
        }

        const amount = parseFloat(state.bookingData.amount);
        if (isNaN(amount) || amount <= 0) {
            alert('Der Betrag muss größer als 0 sein.');
            return;
        }


        const bookingPayload = {
            name: state.bookingData.title,
            amount: amount,
            date: formatDateForStorage(state.bookingData.date),
            operator: state.bookingData.operator,
            class_id: String(classId),
            students: state.selectedStudents,
            fach: state.bookingData.subject,  // Das Fach wird mitgeschickt
        };

        try {
            const response = await fetch('/api/buchungen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(bookingPayload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Fehler beim Speichern der Buchung');

            const newBooking = data.data[0];

            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.map(s =>
                    state.selectedStudents.includes(s.id)
                        ? { ...s, balance: [...(s.balance || []), newBooking] }
                        : s
                ),
                bookings: [...prevState.bookings, newBooking],
                bookingData: { title: '', amount: '', date: getFormattedToday(), operator: '-', subject: '' },
                selectedStudents: []
            }));

            alert('Buchung erfolgreich gespeichert!');
            handleModalState('isBookingModalOpen', false);
        } catch (error) {
            console.error('Fehler beim Speichern der Buchung:', error);
            alert('Es gab einen Fehler: ' + error.message);
        }
    };




    //Settings Schüler
    const openSettings = (student) => {
        setSelectedStudentSettings(student);
        setEditData({
            name: student.name,
            surname: student.surname,
            mobile: student.mobile || '',
        });
    };

    const handleInputSettingsChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSettingsSave = async () => {
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

        if (!selectedStudentSettings) return;

        const updatedStudent = {
            ...editData,
            mail: `${editData.name.toLowerCase()}.${editData.surname.toLowerCase()}@stud.kbw.ch`,
        };

        try {
            const response = await fetch(`/api/schueler/${selectedStudentSettings.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(updatedStudent),
            });

            const data = await response.json();

            if (!response.ok) throw new Error('Fehler beim Speichern der Änderungen');

            console.log(data.data); // Überprüfe, ob die Daten korrekt zurückgegeben werden

            // Aktualisiere den Schüler direkt im Zustand mit den neuen Daten
            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.map(student =>
                    student.id === selectedStudentSettings.id ? { ...student, ...data.data } : student
                ),
            }));

            setSelectedStudentSettings(null); // Schließt das Modal
        } catch (error) {
            console.error(error);
            alert('Fehler beim Aktualisieren der Daten.');
        }
    };


    const handleSettingsDelete = async () => {
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

        if (!selectedStudentSettings || !confirm(`Schüler ${selectedStudentSettings.name} ${selectedStudentSettings.surname} wirklich löschen?`)) return;

        try {
            const response = await fetch(`/api/schueler/${selectedStudentSettings.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (!response.ok) throw new Error('Fehler beim Löschen');

            // Entfernt den Schüler aus der lokalen Liste
            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.filter(student => student.id !== selectedStudentSettings.id),
            }));

            setSelectedStudentSettings(null); // Schließt das Modal
        } catch (error) {
            console.error(error);
            alert('Fehler beim Löschen des Schülers.');
        }
    };

    //Einträge
    const handleDeleteTransaction = async (schuelerId, balanceId) => {
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

        console.log("Lösche Buchung:", { schuelerId, balanceId });

        if (!schuelerId || !balanceId) {
            alert("Fehler: Ungültige IDs!");
            return;
        }

        if (!confirm("Buchung wirklich entfernen?")) return;

        try {
            const response = await fetch(`/api/schueler_balance`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ schueler_id: schuelerId, balance_id: balanceId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Fehler beim Löschen der Buchung");
            }

            // Entferne die Balance aus der lokalen Liste
            setState(prevState => ({
                ...prevState,
                localSchueler: prevState.localSchueler.map(student =>
                    student.id === schuelerId
                        ? { ...student, balance: student.balance.filter(b => b.id !== balanceId) }
                        : student
                ),
            }));


        } catch (error) {
            console.error("Lösch-Fehler:", error);
            alert(error.message);
        }
    };

    //Alle Einträge
    const handleOpenBookingList = async () => {
        const allBookings = [...fetchedBalance, ...localBalance]; // Hier sollten alle relevanten Buchungen geladen werden

        setState(prevState => ({
            ...prevState,
            bookings: prevState.bookings.length === 0 ? allBookings : prevState.bookings,  // Nur wenn `bookings` leer ist, setze sie
            isBookingListModalOpen: true,
        }));
    };



    const handleDeleteBooking = async (bookingId) => {
        if (!confirm("Möchtest du diese Buchung wirklich löschen?")) return;

        try {
            // 1️⃣ Suche alle Schüler, die diese Buchung haben
            const { data: relatedStudents, error: lookupError } = await supabase
                .from('schueler_balance')
                .select('schueler_id')
                .eq('balance_id', bookingId);

            if (lookupError || !relatedStudents) throw new Error("Fehler beim Abrufen der Schüler");

            // 2️⃣ Alle Einträge in `schueler_balance` für diese Buchung löschen
            const { error: deleteBalanceError } = await supabase
                .from('schueler_balance')
                .delete()
                .eq('balance_id', bookingId);

            if (deleteBalanceError) throw new Error("Fehler beim Löschen der Schülerzuordnung");

            // 3️⃣ Die Buchung selbst löschen
            const { error: deleteBookingError } = await supabase
                .from('balance')
                .delete()
                .eq('id', bookingId);

            if (deleteBookingError) throw new Error("Fehler beim Löschen der Buchung");

            // 4️⃣ State aktualisieren
            setState(prevState => ({
                ...prevState,
                bookings: prevState.bookings.filter(booking => booking.id !== bookingId),
                localSchueler: prevState.localSchueler.map(student =>
                    relatedStudents.some(s => s.schueler_id === student.id)
                        ? { ...student, balance: student.balance.filter(b => b.id !== bookingId) }
                        : student
                ),
            }));

            alert("Buchung erfolgreich gelöscht!");
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            alert(error.message);
        }
    };

    const handleEditBooking = async (updatedBooking) => {
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
            const response = await fetch(`/api/buchungen/${updatedBooking.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(updatedBooking),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Fehler beim Speichern");

            setState(prevState => ({
                ...prevState,
                bookings: prevState.bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b),
                localSchueler: prevState.localSchueler.map(student => ({
                    ...student,
                    balance: student.balance.map(b =>
                        b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b
                    ),
                })),
            }));


            alert("Buchung erfolgreich aktualisiert!");
        } catch (error) {
            console.error("Fehler beim Bearbeiten:", error);
            alert(error.message);
        }
    };

    //Export
    const handleExportModalState = (isOpen) => {
        setState(prevState => ({
            ...prevState,
            isExportModalOpen: isOpen,
            ...(isOpen === false ? { selectedStudents: [] } : {}), // Setze die ausgewählten Schüler zurück, wenn das Modal geschlossen wird
        }));
        setIsExportModalOpen(false);
    };


    const generatePDF = (students) => {
        if (!state.selectedStudents || state.selectedStudents.length === 0) {
            alert('Bitte mindestens einen Schüler auswählen.');
            return;
        }

        if (!Array.isArray(students) || students.length === 0) {
            console.error('Ungültige oder leere Schülerdaten');
            return;
        }

        state.selectedStudents.forEach(studentId => {
            const student = students.find(s => s.id === studentId);

            if (!student || !student.balance || !Array.isArray(student.balance) || student.balance.length === 0) {
                console.warn(`Keine Buchungen für ${student?.name} ${student?.surname}`);
                alert(`${student?.name} ${student?.surname} hat keine Buchung`)
                return;
            }

            const doc = new jsPDF();
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");

            // Logo einfügen
            const logoPath = "/pic/kbw-logo.png";
            doc.addImage(logoPath, "PNG", 5, 5, 75, 25);

            // Studentendaten
            doc.text(`${student.name} ${student.surname}`, 10, 45);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`${student.mail}`, 10, 52);
            doc.text(`${klassenname}`, 10, 59);
            doc.text(`Datum: ${new Date().toLocaleDateString()}`, 10, 70);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            const title = 'Kontoübersicht';
            const pageWidth = doc.internal.pageSize.width;
            doc.text(title, pageWidth - doc.getTextWidth(title) - 10, 70);

            // Berechnungen
            const totalCredit = student.balance.filter(entry => entry.operator === '+')
                .reduce((sum, entry) => sum + entry.amount, 0);
            const totalDebit = student.balance.filter(entry => entry.operator === '-')
                .reduce((sum, entry) => sum + entry.amount, 0);
            const finalBalance = totalCredit - totalDebit;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            const totalTextStartY = 78;
            doc.text(`Total Gutschrift: ${totalCredit.toFixed(2)} Fr.`, pageWidth - doc.getTextWidth(`Total Gutschrift: ${totalCredit.toFixed(2)} Fr.`) - 10, totalTextStartY);
            doc.text(`Total Belastung: ${totalDebit.toFixed(2)} Fr.`, pageWidth - doc.getTextWidth(`Total Belastung: ${totalDebit.toFixed(2)} Fr.`) - 10, totalTextStartY + 6);
            doc.setFont("helvetica", "bold");
            doc.text(`Schlusssaldo: ${finalBalance.toFixed(2)} Fr.`, pageWidth - doc.getTextWidth(`Schlusssaldo: ${finalBalance.toFixed(2)} Fr.`) - 10, totalTextStartY + 15);

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Detail-Postenauszug:", 10, totalTextStartY + 30);

            const sortedBalance = [...student.balance].sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split('.');
                const [dayB, monthB, yearB] = b.date.split('.');
                const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
                const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

                if (dateA.getTime() === dateB.getTime()) {
                    return a.id - b.id; // kleinere ID oben, höhere ID unten
                }

                return dateA - dateB; // älteste zuerst, neueste unten
            });


            // Tabelle mit begrenzter Spaltenbreite und Zeilenumbruch
            const tableStartY = totalTextStartY + 40;
            autoTable(doc, {
                startY: tableStartY,
                head: [['Datum', 'Text', 'Belastung', 'Gutschrift']],
                headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
                body: sortedBalance.map(entry => [
                    entry.date,
                    entry.name,
                    entry.operator === '-' ? `${entry.amount.toFixed(2)} Fr.` : '',
                    entry.operator === '+' ? `${entry.amount.toFixed(2)} Fr.` : ''
                ]),
                columnStyles: {
                    1: { cellWidth: 50 } // Begrenzung der Spaltenbreite für Zeilenumbruch
                },
                styles: { fontSize: 10, cellPadding: 3 },
                alternateRowStyles: { fillColor: [240, 240, 240] },
            });

            // Position nach der Tabelle ermitteln
            let finalY = doc.lastAutoTable.finalY || tableStartY + 10;

            // Fette Abschlusszeile hinzufügen
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("Umsatztotal / Schlusssaldo", 15, finalY + 10);
            doc.text(`${totalDebit.toFixed(2)} Fr.`, pageWidth - 110, finalY + 10);
            doc.text(`${totalCredit.toFixed(2)} Fr.`, pageWidth - 70, finalY + 10);
            doc.text(`${finalBalance.toFixed(2)} Fr. Saldo`, pageWidth - 27 - doc.getTextWidth(`${finalBalance.toFixed(2)} Fr.`), finalY + 10);

            // PDF speichern
            doc.save(`Postenauszug_${student.name}_${student.surname}_${new Date().toLocaleDateString()}.pdf`);
        });

        state.selectedStudents = [];
    };

    console.log("localschueler: ", state.localSchueler)
    const refreshSchueler = async () => {
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

        const response = await fetch('/api/getSchuelerMitBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Fehler beim Laden der Schülerdaten');
        }

        return result;
    };


    //Löschen
    const handleDeleteAllSchueler = async () => {
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

        if (!confirm("Wirklich alle Schüler und Buchungen löschen?")) return;

        try {
            const response = await fetch('/api/deleteAllSchueler', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ classId }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Fehler beim Löschen');
            }

            const refreshedSchueler = await refreshSchueler(session.access_token);

            setState(prevState => ({
                ...prevState,
                localSchueler: refreshedSchueler || [],
                bookings: [],
            }));

            alert("Alle Schüler und Buchungen wurden gelöscht.");
            setIsDeleteModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteAllBookings = async () => {
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

        if (!confirm("Wirklich ALLE Buchungen löschen? Die Schüler bleiben erhalten.")) return;

        try {
            const response = await fetch('/api/deleteAllBookings', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ classId }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Fehler beim Löschen der Buchungen');
            }

            alert("Alle Buchungen wurden gelöscht.");

            // Aktualisiere State: alle balances der Schüler auf []
            setState(prevState => ({
                ...prevState,
                bookings: [],
                localSchueler: prevState.localSchueler.map(s => ({ ...s, balance: [] }))
            }));

            setIsDeleteModalOpen(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteAll = async () => {
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

        if (!confirm("⚠️ Möchtest du wirklich ALLES löschen – Schüler, Buchungen und Klasse selbst?")) return;

        try {
            const response = await fetch('/api/deleteAll', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ classId }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Fehler beim vollständigen Löschen');
            }

            alert("Alles gelöscht – einschliesslich der Klasse!");

            // Optional: Weiterleitung zur Übersichtsseite
            window.location.href = "/klassen"; // oder wohin du willst

        } catch (err) {
            alert(err.message);
        }
    };







    const filteredSchueler = allSchueler
        .filter(schueler => String(schueler.class) === String(classId))
        .filter(schueler =>
            `${schueler.name} ${schueler.surname}`.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
        .sort((a, b) => a.surname.toLowerCase().localeCompare(b.surname.toLowerCase()));
    console.log("filtered, ", filteredSchueler)
    console.log(state.localSchueler)
    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="container">
                <h1 className='title'>Klasse {klassenname}</h1>
                <div className="controls">
                    <button onClick={() => router.push('/klassen')}>← Zurück</button>
                    <input
                        type="text"
                        placeholder="Schüler suchen..."
                        value={state.searchQuery}
                        onChange={(e) => setState(prevState => ({ ...prevState, searchQuery: e.target.value }))}
                        className="search-bar"
                    />
                </div>
                <div className="student-list">
                    {filteredSchueler.length > 0 ? (
                        filteredSchueler.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onToggleDropdown={toggleDropdown}
                                isOpen={state.openStudent === student.id}
                                onOpenSettings={openSettings}
                                onDeleteTransaction={handleDeleteTransaction}
                            />
                        ))
                    ) : (
                        <p>Keine Schüler in dieser Klasse.</p>
                    )}
                </div>

                <div className="actions">
                    <button className="btn-orange" onClick={() => handleModalState('isBookingModalOpen', true)}>Buchung hinzufügen</button>
                    <button className="btn-black" onClick={() => handleModalState('isModalOpen', true)}>Schüler:in hinzufügen</button>
                    <button className="btn-black" onClick={() => handleModalState('isImportModalOpen', true)}>Liste importieren</button>
                    <button className='btn-black' onClick={handleOpenBookingList}>Alle Einträge</button>
                    <button className="btn-black" onClick={() => setIsExportModalOpen(true)}>Exportieren</button>
                    <button className="btn-delete" onClick={() => setIsDeleteModalOpen(true)}>Delete funktionen</button>
                    <button className='btn-orange' onClick={() => router.push(`/klassen/${id}/statistik`)}>Statistik</button>
                </div>

                {state.isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Neuen Schüler hinzufügen</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Vorname"
                                value={state.newStudent.name}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Nachname"
                                value={state.newStudent.surname}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile (optional)"
                                value={state.newStudent.mobile}
                                onChange={handleInputChange}
                            />
                            <div className="modal-buttons">
                                <button onClick={handleAddStudent}>Hinzufügen</button>
                                <button onClick={() => handleModalState('isModalOpen', false)}>Abbrechen</button>
                            </div>
                        </div>
                    </div>
                )}

                {state.isImportModalOpen && (
                    <ImportModal
                        isOpen={state.isImportModalOpen}
                        onClose={() => handleModalState('isImportModalOpen', false)}
                        onImportCSV={handleImportCSV}
                        onFileChange={(e) => setState(prevState => ({ ...prevState, importFile: e.target.files[0] }))}
                    />
                )}
                {state.isBookingModalOpen && (
                    <BookingModal
                        isOpen={state.isBookingModalOpen}
                        onClose={() => handleModalState('isBookingModalOpen', false)}
                        onSave={handleSaveBooking}
                        bookingData={state.bookingData}
                        onInputChange={handleBookingInputChange}
                        students={filteredSchueler}
                        selectedStudents={state.selectedStudents}
                        onSelectStudent={handleSelectStudent}
                        onSelectAll={handleSelectAll}
                    />
                )}
                {selectedStudentSettings && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h2>Schüler bearbeiten</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Vorname"
                                value={editData.name}
                                onChange={handleInputSettingsChange}
                            />
                            <input
                                type="text"
                                name="surname"
                                placeholder="Nachname"
                                value={editData.surname}
                                onChange={handleInputSettingsChange}
                            />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile (optional)"
                                value={editData.mobile}
                                onChange={handleInputSettingsChange}
                            />
                            <p><strong>Email:</strong> {`${editData.name.toLowerCase()}.${editData.surname.toLowerCase()}@stud.kbw.ch`}</p>
                            <div className="modal-buttons">
                                <button onClick={handleSettingsSave}>Speichern</button>
                                <button className="btn-delete" onClick={handleSettingsDelete}>Löschen</button>
                                <button onClick={() => setSelectedStudentSettings(null)}>Abbrechen</button>
                            </div>
                        </div>
                    </div>
                )}
                <BookingListModal
                    isOpen={state.isBookingListModalOpen} // Direkt aus state
                    onClose={() => setState(prev => ({ ...prev, isBookingListModalOpen: false }))}
                    bookings={state.bookings} // Buchungen aus state holen
                    onEdit={handleEditBooking}
                    onDelete={handleDeleteBooking}
                />
                {isExportModalOpen && (
                    <ExportModal
                        isOpen={isExportModalOpen}
                        onClose={() => handleExportModalState(false)} // Beim Schließen zurücksetzen
                        students={filteredSchueler}
                        selectedStudents={state.selectedStudents}
                        onSelectStudent={handleSelectStudent}
                        onSelectAll={handleSelectAll}
                        onGeneratePDF={generatePDF}
                    />
                )}
                <LoeschModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeleteAllSchueler={handleDeleteAllSchueler}
                    onDeleteAllBookings={handleDeleteAllBookings}
                    onDeleteAll={handleDeleteAll}
                />


            </div>
            <Footer />
</div>
    );
}
