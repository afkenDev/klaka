"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/admin.css";

export default function Admin() {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  const [sqlInput, setSqlInput] = useState("");
  const [sqlOutput, setSqlOutput] = useState(null);
  const [executingSql, setExecutingSql] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("user_profile")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile || profile.role_id !== 2) {
        router.push("/");
      } else {
        setAccessGranted(true);
      }
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      setInviteStatus("❌ Bitte E-Mail eingeben.");
      return;
    }

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const result = await res.json();

      if (result.error) {
        setInviteStatus(`❌ Fehler: ${result.error}`);
      } else {
        setInviteStatus("✅ Einladung gesendet und Markierung gesetzt!");
      }
    } catch (err) {
      setInviteStatus("❌ Fehler beim Senden der Einladung.");
    }
  };

  const executeSql = async () => {
    if (!sqlInput.trim()) {
      setSqlOutput({ error: "Bitte gib eine SQL-Abfrage ein." });
      return;
    }

    setExecutingSql(true);
    try {
      // Auth-Session holen
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSqlOutput({ error: "Nicht angemeldet" });
        return;
      }

      const res = await fetch("/api/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ query: sqlInput }),
      });

      const result = await res.json();
      setSqlOutput(result);
    } catch (err) {
      setSqlOutput({ error: err.message || "Fehler bei der SQL-Abfrage" });
    } finally {
      setExecutingSql(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <p>Lade...</p>
      </div>
    );

  if (!accessGranted) return null;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="admin-section">
        <div className="container">
          <h2>Adminbereich</h2>
          <div className="admin-info-box">
            <h3>Willkommen im Adminbereich</h3>
            <p>
              Du befindest dich im geschützten Administrationsbereich dieser
              Plattform. Hier hast du erweiterten Zugriff auf Funktionen, die
              ausschließlich autorisierten Nutzern vorbehalten sind.
            </p>

            <h4>Benutzerverwaltung (via Supabase Auth)</h4>
            <p>
              Über das untenstehende Formular kannst du gezielt neue Benutzer
              per E-Mail einladen. Nach dem Versand wird ein temporärer Account
              in Supabase erstellt und automatisch in der Datenbank markiert.
              Eingeladene Nutzer erhalten eine Einladungs-Mail und können nach
              der Erstanmeldung ihr eigenes Passwort festlegen.
            </p>
            <ul>
              <li>Die Einladung ist nur für die angegebene E-Mail gültig</li>
              <li>
                Rollen und Rechte werden serverseitig über{" "}
                <code>user_profile</code> gepflegt
              </li>
              <li>
                Du kannst auch mehreren Nutzern nacheinander Einladungen senden
              </li>
            </ul>

            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Benutzer einladen</h2>
              </div>
              <label htmlFor="inviteEmail">E-Mail Adresse</label>
              <input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                placeholder="beispiel@domain.de"
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <button onClick={handleInvite}>Einladung senden</button>

              {inviteStatus && (
                <div
                  className={`status-message ${
                    inviteStatus.includes("❌") ? "error" : "success"
                  }`}
                >
                  {inviteStatus}
                </div>
              )}
            </div>

            <h4>Direkter Datenbankzugriff</h4>
            <p>
              Zusätzlich kannst du über das SQL-Modul direkt mit der
              Supabase-Datenbank kommunizieren. Diese Funktion ist mächtig und
              sollte nur mit Vorsicht genutzt werden.
            </p>
            <p>Typische Anwendungsfälle:</p>
            <ol>
              <li>Auswertung oder Export bestimmter Daten</li>
              <li>Korrigieren fehlerhafter Einträge</li>
              <li>
                Temporäre Anpassungen in Tabellen wie <code>balance</code> oder{" "}
                <code>schueler</code>
              </li>
            </ol>

            <p>
              <strong>Wichtig:</strong> Alle Änderungen, die du hier
              durchführst, wirken sich direkt auf die Live-Datenbank aus. Es
              gibt kein automatisches Backup. Bitte handle mit Sorgfalt.
            </p>
            <div className="manual">
              {/* Öffnen-Button */}
              <label htmlFor="db-manual-toggle" className="open-manual-button">
                📘 Vollständiges Datenbank-Handbuch öffnen
              </label>

              {/* Checkbox + Overlay + Modal */}
              <input type="checkbox" id="db-manual-toggle" hidden />

              <div className="manual-overlay"></div>

              <div className="manual-modal">
                <label htmlFor="db-manual-toggle" className="close-button">
                  ×
                </label>
                <h2>Datenbank-Handbuch: Klassenkasse</h2>

                <section>
                  <h3>
                    📊 <code>balance</code> – Buchungen
                  </h3>
                  <p>
                    Speichert sämtliche finanziellen Ein- und Ausgänge pro
                    Klasse.
                  </p>
                  <ul>
                    <li>
                      <strong>id</strong>: Primärschlüssel
                    </li>
                    <li>
                      <strong>name</strong> (varchar): Bezeichnung der Buchung
                    </li>
                    <li>
                      <strong>amount</strong> (numeric): Betrag (positiv oder
                      negativ)
                    </li>
                    <li>
                      <strong>date</strong> (varchar): Datum der Buchung
                    </li>
                    <li>
                      <strong>updated_at</strong> (timestamp): Letzte Änderung
                    </li>
                    <li>
                      <strong>operator</strong> (varchar): "ein" oder "aus"
                    </li>
                    <li>
                      <strong>class_id</strong> (int8): 🔗 Fremdschlüssel zu{" "}
                      <code>klasse.id</code>
                    </li>
                    <li>
                      <strong>fach</strong> (text): Fachbezug, z. B. «Mathe»,
                      «Projektwoche»
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>
                    🧑 <code>schueler</code> – Schüler:innen
                  </h3>
                  <p>Verwaltet die Mitglieder einer Klasse mit Kontaktdaten.</p>
                  <ul>
                    <li>
                      <strong>id</strong>: Primärschlüssel
                    </li>
                    <li>
                      <strong>name</strong> / <strong>surname</strong>: Vor- und
                      Nachname
                    </li>
                    <li>
                      <strong>mail</strong>: E-Mail-Adresse
                    </li>
                    <li>
                      <strong>mobile</strong>: Telefonnummer
                    </li>
                    <li>
                      <strong>class</strong> (int8): 🔗 Fremdschlüssel zu{" "}
                      <code>klasse.id</code>
                    </li>
                    <li>
                      <strong>user_id</strong> (uuid): 🔗 Verbindung zu{" "}
                      <code>auth.users.id</code>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>
                    🔗 <code>schueler_balance</code> – Zuordnung Buchung ↔
                    Schüler
                  </h3>
                  <p>Verbindet Buchungen mit einzelnen Schüler:innen.</p>
                  <ul>
                    <li>
                      <strong>id</strong>: Primärschlüssel
                    </li>
                    <li>
                      <strong>schueler_id</strong>: 🔗 zu{" "}
                      <code>schueler.id</code>
                    </li>
                    <li>
                      <strong>balance_id</strong>: 🔗 zu <code>balance.id</code>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>
                    🏫 <code>klasse</code> – Klassenverwaltung
                  </h3>
                  <p>Definiert Klassen mit Metadaten.</p>
                  <ul>
                    <li>
                      <strong>id</strong>: Primärschlüssel
                    </li>
                    <li>
                      <strong>lastActivity</strong>: Letzter Zugriff / Änderung
                    </li>
                    <li>
                      <strong>color</strong>: UI-Farbe
                    </li>
                    <li>
                      <strong>klassenname</strong>: z. B. "IMS23a"
                    </li>
                    <li>
                      <strong>vorname</strong>, <strong>nachname</strong>: des
                      Ansprechpartners (optional)
                    </li>
                    <li>
                      <strong>user_id</strong> (uuid): 🔗 zu{" "}
                      <code>auth.users.id</code>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>
                    🧑‍🏫 <code>user_klasse</code> – Verknüpfung User ↔ Klasse
                  </h3>
                  <p>Erlaubt mehreren Usern Zugriff auf Klassen.</p>
                  <ul>
                    <li>
                      <strong>id</strong>: Primärschlüssel
                    </li>
                    <li>
                      <strong>klasse_id</strong>: 🔗 zu <code>klasse.id</code>
                    </li>
                    <li>
                      <strong>user_id</strong>: 🔗 zu <code>auth.users.id</code>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>
                    🛡️ <code>user_profile</code> – Benutzerrollen
                  </h3>
                  <p>Erweiterung der Supabase-Auth mit Rollensteuerung.</p>
                  <ul>
                    <li>
                      <strong>id</strong>: 🔗 zu <code>auth.users.id</code>
                    </li>
                    <li>
                      <strong>created_at</strong>: Erstellungsdatum
                    </li>
                    <li>
                      <strong>role_id</strong>: 🔗 zu <code>rollen.id</code>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3>
                    🎭 <code>rollen</code> – Rollenmodell
                  </h3>
                  <p>Definiert die Rechtelevel im System.</p>
                  <ul>
                    <li>
                      <strong>id</strong>: Primärschlüssel
                    </li>
                    <li>
                      <strong>name</strong>: z. B. "admin", "lehrer", "mitglied"
                    </li>
                  </ul>
                </section>

                <p>
                  <strong>Letzter Hinweis:</strong> Fremdschlüsselverknüpfungen
                  und Datenzugriff erfolgen über Supabase, der Schutz der
                  Datenbank liegt in deiner Verantwortung.
                </p>
              </div>

              <label
                htmlFor="db-manual-toggle"
              ></label>
            </div>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>SQL-Abfrage</h2>
              </div>
              <label htmlFor="sqlQuery">SQL-Befehl</label>
              <textarea
                id="sqlQuery"
                value={sqlInput}
                placeholder="SELECT * FROM users LIMIT 10"
                onChange={(e) => setSqlInput(e.target.value)}
              />
              <button onClick={executeSql} disabled={executingSql}>
                {executingSql ? "Wird ausgeführt..." : "SQL ausführen"}
              </button>

              {sqlOutput && (
                <div className={`sql-output ${sqlOutput.error ? "error" : ""}`}>
                  {sqlOutput.error
                    ? `Fehler: ${sqlOutput.error}`
                    : JSON.stringify(sqlOutput.data || sqlOutput, null, 2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
