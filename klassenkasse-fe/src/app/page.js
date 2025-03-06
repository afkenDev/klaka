'use client'

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import '../app/styles/global.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-container">

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
