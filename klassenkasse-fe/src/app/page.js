'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/global.css';

export default function Home() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="home-main">
        <h1 className="home-title">Klassenkasse</h1>
        <p className="home-description">
          Verwalte deine Klassenfinanzen einfach, transparent und zeitsparend.
        </p>

        <Link href="/login">
          <button className="home-login-button">Applikation Starten</button>
        </Link>

        <section className="home-features">
          <div className="feature-card">
            <h3>Übersichtliche Statistiken</h3>
            <p>Behalte jederzeit den Überblick über Ausgaben, Einzahlungen und Salden deiner Klasse.</p>
          </div>
          <div className="feature-card">
            <h3>PDF-Export</h3>
            <p>Erstelle übersichtliche Berichte für Eltern, Lehrpersonen und die Schulverwaltung mit nur einem Klick.</p>
          </div>
        </section>

        <section className="home-cta">
          <h2>Bereit, loszulegen?</h2>
          <p>Melde dich jetzt an und führe die Klassenkasse <b>stressfrei und digital</b>!</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
