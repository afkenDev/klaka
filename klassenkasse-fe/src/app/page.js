'use client';

import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
<<<<<<< HEAD
import Link from 'next/link';
=======
import './styles/global.css';
>>>>>>> f356a8b4def3d8f37081963f8df5b1b30ef42440

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
