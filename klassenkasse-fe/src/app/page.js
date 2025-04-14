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
          Verwalte deine Klassenfinanzen einfach und effizient mit unserem System.
        </p>
        <Link href="/login">
          <button className="home-login-button">Jetzt Einloggen</button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
