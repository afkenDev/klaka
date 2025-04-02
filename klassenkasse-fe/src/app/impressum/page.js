import Head from "next/head";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/classic.css';


export default function Impressum() {
  return (
    <>
      <Head>
        <title>Impressum</title>
        <meta name="description" content="Impressum der Webseite" />
      </Head>
            <Navbar />
      
      <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Impressum</h1>
<p>
  Angaben gemäss schweizerischem Recht:
  <br />
  <strong>Kantonsschule Büelrain</strong>
  <br />
  Rosenstrasse 1<br />
  8400 Winterthur<br />
  Schweiz
</p>

<h2 className="text-xl font-semibold mt-4">Kontakt</h2>
<p>
  Telefon: 052 260 03 03
  <br />
  E-Mail: admin@kbw.ch
  <br />
  Website: <a href="https://www.kbw.ch" className="text-blue-500 hover:underline">www.kbw.ch</a>
</p>

<h2 className="text-xl font-semibold mt-4">Verantwortlich für den Inhalt</h2>
<p>
  Kantonsschule Büelrain (Anschrift wie oben)
  <br />
  Die Redaktion und Pflege der Inhalte erfolgt durch das Webteam der Kantonsschule Büelrain.
</p>

<h2 className="text-xl font-semibold mt-4">Haftungsausschluss</h2>
<p>
  Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt.
  Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können
  wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäss
  schweizerischem Recht für eigene Inhalte auf diesen Seiten verantwortlich.
  Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
  Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
  rechtswidrige Tätigkeit hinweisen.
</p>

<h2 className="text-xl font-semibold mt-4">Haftung für Links</h2>
<p>
  Diese Webseite enthält Links zu externen Webseiten Dritter, auf deren
  Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
  Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
  Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
  Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
  Rechtsverstösse überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
  Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
  verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
  nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
  Links umgehend entfernen.
</p>



<h2 className="text-xl font-semibold mt-4">Technische Informationen</h2>
<p>
  Diese Webseite wurde mit modernen Webtechnologien erstellt und ist für eine
  optimale Darstellung auf verschiedenen Geräten (Desktop, Tablet, Smartphone)
  ausgelegt. Die Seite verwendet:
  <br />
  - <strong>Next.js</strong> als React-Framework für serverseitiges Rendering.
  <br />
  - <strong>Tailwind CSS</strong> für das Styling und responsive Design.
  <br />
  - <strong>HTML5</strong> und <strong>CSS3</strong> für die Struktur und Gestaltung.
  <br />
  - <strong>JavaScript</strong> für interaktive Funktionen.
</p>


<h2 className="text-xl font-semibold mt-4">Änderungen dieser Seite</h2>
<p>
  Wir behalten uns vor, diese Impressum-Seite jederzeit zu aktualisieren oder zu
  ändern, um sie an geänderte rechtliche oder technische Anforderungen anzupassen.
  Bitte besuchen Sie diese Seite regelmässig, um über mögliche Änderungen informiert
  zu bleiben.
</p>
      </main>
            <Footer />
      
    </>
  );
}