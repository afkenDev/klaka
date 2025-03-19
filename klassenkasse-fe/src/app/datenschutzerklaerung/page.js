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
        <h1>Datenschutzerklärung</h1>
        <h2 id="m4158">Präambel</h2>
        <p>Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang im Rahmen der Bereitstellung unserer Applikation verarbeiten.</p>
        <p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>
        <p>Stand: 19. März 2025</p>
        <h2>Inhaltsübersicht</h2> 
        <ul className="index">
          <li><a className="indexLink" href="#m367">Registrierung, Anmeldung und Nutzerkonto</a></li>
          <li><a className="indexLink" href="#m4158">Präambel</a></li>
          <li><a className="indexLink" href="#m3">Verantwortlicher</a></li>
          <li><a className="indexLink" href="#mOverview">Übersicht der Verarbeitungen</a></li>
          <li><a className="indexLink" href="#m2427">Massgebliche Rechtsgrundlagen</a></li>
          <li><a className="indexLink" href="#m27">Sicherheitsmassnahmen</a></li>
          <li><a className="indexLink" href="#m25">Übermittlung von personenbezogenen Daten</a></li>
          <li><a className="indexLink" href="#m24">Internationale Datentransfers</a></li>
          <li><a className="indexLink" href="#m12">Allgemeine Informationen zur Datenspeicherung und Löschung</a></li>
          <li><a className="indexLink" href="#m225">Bereitstellung des Onlineangebots und Webhosting</a></li>
        </ul>
        
        <h2 id="m3">Verantwortlicher</h2>
        <p>Kantonsschule Büelrain<br />Rosenstrasse 1<br />8400 Winterthur, Schweiz</p>
        <p>Vertretungsberechtigte Personen: Kantonsschule Büelrain</p>
        <p>E-Mail-Adresse: <a href="mailto:admin@kbw.ch">admin@kbw.ch</a></p>
        <p>Telefon: 052 260 03 03</p>

        <h2 id="mOverview">Übersicht der Verarbeitungen</h2>
        <p>Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.</p>
        <h3>Arten der verarbeiteten Daten</h3>
        <ul>
          <li>Bestandsdaten.</li>
          <li>Kontaktdaten.</li>
          <li>Inhaltsdaten.</li>
          <li>Nutzungsdaten.</li>
          <li>Meta-, Kommunikations- und Verfahrensdaten.</li>
          <li>Protokolldaten.</li>
        </ul>
        <h3>Kategorien betroffener Personen</h3>
        <ul>
          <li>Nutzer.</li>
        </ul>
        <h3>Zwecke der Verarbeitung</h3>
        <ul>
          <li>Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten.</li>
          <li>Sicherheitsmassnahmen.</li>
          <li>Organisations- und Verwaltungsverfahren.</li>
          <li>Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
          <li>Informationstechnische Infrastruktur.</li>
        </ul>
        
        <h2 id="m2427">Massgebliche Rechtsgrundlagen</h2>
        <p><strong>Massgebliche Rechtsgrundlagen nach dem Schweizer Datenschutzgesetz: </strong>Wenn Sie sich in der Schweiz befinden, bearbeiten wir Ihre Daten auf Grundlage des Bundesgesetzes über den Datenschutz (kurz „Schweizer DSG"). Anders als beispielsweise die DSGVO sieht das Schweizer DSG grundsätzlich nicht vor, dass eine Rechtsgrundlage für die Bearbeitung der Personendaten genannt werden muss und die Bearbeitung von Personendaten nach Treu und Glauben durchgeführt wird, rechtmässig und verhältnismässig ist (Art. 6 Abs. 1 und 2 des Schweizer DSG). Zudem werden Personendaten von uns nur zu einem bestimmten, für die betroffene Person erkennbaren Zweck beschafft und nur so bearbeitet, wie es mit diesem Zweck vereinbar ist (Art. 6 Abs. 3 des Schweizer DSG).</p>

        <h2 id="m27">Sicherheitsmassnahmen</h2>
        <p>Wir treffen nach Massgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmasses der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Massnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.</p>
        <p>Zu den Massnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und Reaktionen auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.</p>
        <p>Sicherung von Online-Verbindungen durch TLS-/SSL-Verschlüsselungstechnologie (HTTPS): Um die Daten der Nutzer, die über unsere Online-Dienste übertragen werden, vor unerlaubten Zugriffen zu schützen, setzen wir auf die TLS-/SSL-Verschlüsselungstechnologie. Secure Sockets Layer (SSL) und Transport Layer Security (TLS) sind die Eckpfeiler der sicheren Datenübertragung im Internet. Diese Technologien verschlüsseln die Informationen, die zwischen der Website oder App und dem Browser des Nutzers (oder zwischen zwei Servern) übertragen werden, wodurch die Daten vor unbefugtem Zugriff geschützt sind. TLS, als die weiterentwickelte und sicherere Version von SSL, gewährleistet, dass alle Datenübertragungen den höchsten Sicherheitsstandards entsprechen. Wenn eine Website durch ein SSL-/TLS-Zertifikat gesichert ist, wird dies durch die Anzeige von HTTPS in der URL signalisiert. Dies dient als ein Indikator für die Nutzer, dass ihre Daten sicher und verschlüsselt übertragen werden.</p>

        <h2 id="m25">Übermittlung von personenbezogenen Daten</h2>
        <p>Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass diese an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt beziehungsweise ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten können z. B. mit IT-Aufgaben beauftragte Dienstleister gehören oder Anbieter von Diensten und Inhalten, die in eine Website eingebunden sind. In solchen Fällen beachten wir die gesetzlichen Vorgaben und schliessen insbesondere entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.</p>

        <h2 id="m24">Internationale Datentransfers</h2>
        <p>Bekanntgabe von Personendaten ins Ausland: Gemäss dem Schweizer DSG geben wir personenbezogene Daten nur dann ins Ausland bekannt, wenn ein angemessener Schutz der betroffenen Personen gewährleistet ist (Art. 16 Schweizer DSG). Sofern der Bundesrat keinen angemessenen Schutz festgestellt hat (Liste: <a href="https://www.bj.admin.ch/bj/de/home/staat/datenschutz/internationales/anerkennung-staaten.html" target="_blank">https://www.bj.admin.ch/bj/de/home/staat/datenschutz/internationales/anerkennung-staaten.html</a>), ergreifen wir alternative Sicherheitsmassnahmen.</p>
        <p>Für Datenübermittlungen in die USA stützen wir uns vorrangig auf das Data Privacy Framework (DPF), welches durch einen Angemessenheitsbeschluss der Schweiz vom 07.06.2024 als sicherer Rechtsrahmen anerkannt wurde. Zusätzlich haben wir mit den jeweiligen Anbietern Standarddatenschutzklauseln abgeschlossen, die von der Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) genehmigt wurden und vertragliche Verpflichtungen zum Schutz Ihrer Daten festlegen.</p>
        <p>Diese zweifache Absicherung gewährleistet einen umfassenden Schutz Ihrer Daten: Das DPF bildet die primäre Schutzebene, während die Standarddatenschutzklauseln als zusätzliche Sicherheit dienen. Sollten sich Änderungen im Rahmen des DPF ergeben, greifen die Standarddatenschutzklauseln als zuverlässige Rückfalloption ein. So stellen wir sicher, dass Ihre Daten auch bei etwaigen politischen oder rechtlichen Veränderungen stets angemessen geschützt bleiben.</p>
        <p>Bei den einzelnen Diensteanbietern informieren wir Sie darüber, ob sie nach dem DPF zertifiziert sind und ob Standarddatenschutzklauseln vorliegen. Die Liste der zertifizierten Unternehmen sowie weitere Informationen zum DPF finden Sie auf der Website des US-Handelsministeriums unter <a href="https://www.dataprivacyframework.gov/" target="_blank">https://www.dataprivacyframework.gov/</a> (in englischer Sprache).</p>
        <p>Für Datenübermittlungen in andere Drittländer gelten entsprechende Sicherheitsmassnahmen, einschliesslich internationaler Verträge, spezifischer Garantien, von der EDÖB genehmigter Standarddatenschutzklauseln oder von der EDÖB oder einer zuständigen Datenschutzbehörde eines anderen Landes vorab anerkannter unternehmensinterner Datenschutzvorschriften.</p>

        <h2 id="m12">Allgemeine Informationen zur Datenspeicherung und Löschung</h2>
        <p>Wir löschen personenbezogene Daten, die wir verarbeiten, gemäss den gesetzlichen Bestimmungen, sobald die zugrundeliegenden Einwilligungen widerrufen werden oder keine weiteren rechtlichen Grundlagen für die Verarbeitung bestehen. Dies betrifft Fälle, in denen der ursprüngliche Verarbeitungszweck entfällt oder die Daten nicht mehr benötigt werden. Ausnahmen von dieser Regelung bestehen, wenn gesetzliche Pflichten oder besondere Interessen eine längere Aufbewahrung oder Archivierung der Daten erfordern.</p>
        <p>Insbesondere müssen Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen oder deren Speicherung notwendig ist zur Rechtsverfolgung oder zum Schutz der Rechte anderer natürlicher oder juristischer Personen, entsprechend archiviert werden.</p>
        <p>Unsere Datenschutzhinweise enthalten zusätzliche Informationen zur Aufbewahrung und Löschung von Daten, die speziell für bestimmte Verarbeitungsprozesse gelten.</p>
        <p>Bei mehreren Angaben zur Aufbewahrungsdauer oder Löschungsfristen eines Datums, ist stets die längste Frist massgeblich.</p>
        <p>Beginnt eine Frist nicht ausdrücklich zu einem bestimmten Datum und beträgt sie mindestens ein Jahr, so startet sie automatisch am Ende des Kalenderjahres, in dem das fristauslösende Ereignis eingetreten ist. Im Fall laufender Vertragsverhältnisse, in deren Rahmen Daten gespeichert werden, ist das fristauslösende Ereignis der Zeitpunkt des Wirksamwerdens der Kündigung oder sonstige Beendigung des Rechtsverhältnisses.</p>
        <p>Daten, die nicht mehr für den ursprünglich vorgesehenen Zweck, sondern aufgrund gesetzlicher Vorgaben oder anderer Gründe aufbewahrt werden, verarbeiten wir ausschliesslich zu den Gründen, die ihre Aufbewahrung rechtfertigen.</p>
        <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
        <ul className="mElements">
          <li><strong>Aufbewahrung und Löschung von Daten: </strong>Die folgenden allgemeinen Fristen gelten für die Aufbewahrung und Archivierung nach dem Schweizer Recht:
            <ul> 
              <li>10 Jahre - Aufbewahrungsfrist für Bücher und Aufzeichnungen, Jahresabschlüsse, Inventare, Lageberichte, Eröffnungsbilanzen, Buchungsbelege und Rechnungen sowie alle erforderlichen Arbeitsanweisungen und sonstigen Organisationsunterlagen (Art. 958f des Schweizerischen Obligationenrechts (OR)).</li>
              <li>10 Jahre - Daten, die zur Berücksichtigung potenzieller Schadenersatzansprüche oder ähnlicher vertraglicher Ansprüche und Rechte notwendig sind, sowie für die Bearbeitung damit verbundener Anfragen, basierend auf früheren Geschäftserfahrungen und den üblichen Branchenpraktiken, werden für den Zeitraum der gesetzlichen Verjährungsfrist von zehn Jahren gespeichert, es sei denn, eine kürzere Frist von fünf Jahren ist massgeblich, die in bestimmten Fällen einschlägig ist (Art. 127, 130 OR). Mit Ablauf von fünf Jahren verjähren die Forderungen für Miet-, Pacht- und Kapitalzinse sowie andere periodische Leistungen, aus Lieferung von Lebensmitteln, für Beköstigung und für Wirtsschulden, sowie aus Handwerksarbeit, Kleinverkauf von Waren, ärztlicher Besorgung, Berufsarbeiten von Anwälten, Rechtsagenten, Prokuratoren und Notaren und aus dem Arbeitsverhältnis von Arbeitnehmern (Art. 128 OR).</li> 
            </ul>
          </li>
        </ul>
        
        <h2 id="m225">Bereitstellung des Onlineangebots und Webhosting</h2>
        <p>Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder das Endgerät der Nutzer zu übermitteln.</p>
        <ul className="mElements">
          <li><strong>Verarbeitete Datenarten:</strong> Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen); Meta-, Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben, Identifikationsnummern, beteiligte Personen). Protokolldaten (z. B. Logfiles betreffend Logins oder den Abruf von Daten oder Zugriffszeiten.).</li>
          <li><strong>Betroffene Personen:</strong> Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
          <li><strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit; Informationstechnische Infrastruktur (Betrieb und Bereitstellung von Informationssystemen und technischen Geräten (Computer, Server etc.)). Sicherheitsmassnahmen.</li>
          <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung".</li>
          <li className=""><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
        </ul>
        <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
        <ul className="mElements">
          <li><strong>Bereitstellung Onlineangebot auf eigener/ dedizierter Serverhardware: </strong>Für die Bereitstellung unseres Onlineangebotes nutzen wir von uns betriebene Serverhardware sowie den damit verbundenen Speicherplatz, die Rechenkapazität und die Software; <span className=""><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</span></li>
          <li><strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Der Zugriff auf unser Onlineangebot wird in Form von sogenannten "Server-Logfiles" protokolliert. Zu den Serverlogfiles können die Adresse und der Name der abgerufenen Webseiten und Dateien, Datum und Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor besuchte Seite) und im Regelfall IP-Adressen und der anfragende Provider gehören. Die Serverlogfiles können zum einen zu Sicherheitszwecken eingesetzt werden, z. B. um eine Überlastung der Server zu vermeiden (insbesondere im Fall von missbräuchlichen Angriffen, sogenannten DDoS-Attacken), und zum anderen, um die Auslastung der Server und ihre Stabilität sicherzustellen; <span className=""><strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO). </span><strong>Löschung von Daten:</strong> Logfile-Informationen werden für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht oder anonymisiert. Daten, deren weitere Aufbewahrung zu Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des jeweiligen Vorfalls von der Löschung ausgenommen.</li>
        </ul>
        
        <h2 id="m367">Registrierung, Anmeldung und Nutzerkonto</h2>
        <p>Nutzer können ein Nutzerkonto anlegen. Im Rahmen der Registrierung werden den Nutzern die erforderlichen Pflichtangaben mitgeteilt und zu Zwecken der Bereitstellung des Nutzerkontos auf Grundlage vertraglicher Pflichterfüllung verarbeitet. Zu den verarbeiteten Daten gehören insbesondere die Login-Informationen (Nutzername, Passwort sowie eine E-Mail-Adresse).</p>
        <p>Im Rahmen der Inanspruchnahme unserer Registrierungs- und Anmeldefunktionen sowie der Nutzung des Nutzerkontos speichern wir die IP-Adresse und den Zeitpunkt der jeweiligen Nutzerhandlung. Die Speicherung erfolgt auf Grundlage unserer berechtigten Interessen als auch jener der Nutzer an einem Schutz vor Missbrauch und sonstiger unbefugter Nutzung. Eine Weitergabe dieser Daten an Dritte erfolgt grundsätzlich nicht, es sei denn, sie ist zur Verfolgung unserer Ansprüche erforderlich oder es besteht eine gesetzliche Verpflichtung hierzu.</p>
        <p>Die Nutzer können über Vorgänge, die für deren Nutzerkonto relevant sind, wie z. B. technische Änderungen, per E-Mail informiert werden.</p>
        <ul className="mElements">
          <li><strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z. B. der vollständige Name, Wohnadresse, Kontaktinformationen, Kundennummer, etc.); Kontaktdaten (z. B. Post- und E-Mail-Adressen oder Telefonnummern); Inhaltsdaten (z. B. textliche oder bildliche Nachrichten und Beiträge sowie die sie betreffenden Informationen, wie z. B. Angaben zur Autorenschaft oder Zeitpunkt der Erstellung); Nutzungsdaten (z. B. Seitenaufrufe und Verweildauer, Klickpfade, Nutzungsintensität und -frequenz, verwendete Gerätetypen und Betriebssysteme, Interaktionen mit Inhalten und Funktionen). Protokolldaten (z. B. Logfiles betreffend Logins oder den Abruf von Daten oder Zugriffszeiten.).</li>
          <li><strong>Betroffene Personen:</strong> Nutzer (z. B. Webseitenbesucher, Nutzer von Onlinediensten).</li>
          <li><strong>Zwecke der Verarbeitung:</strong> Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten; Sicherheitsmassnahmen; Organisations- und Verwaltungsverfahren. Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.</li>
          <li><strong>Aufbewahrung und Löschung:</strong> Löschung entsprechend Angaben im Abschnitt "Allgemeine Informationen zur Datenspeicherung und Löschung". Löschung nach Kündigung.</li>
          <li className=""><strong>Rechtsgrundlagen:</strong> Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO). Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).</li>
        </ul>
        <p><strong>Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:</strong></p>
        <ul className="mElements">
          <li><strong>Registrierung mit Klarnamen: </strong>Aufgrund der Natur unserer Community bitten wir die Nutzer unser Angebot nur unter Verwendung von Klarnamen zu nutzen. D. h. die Nutzung von Pseudonymen ist nicht zulässig; <span className=""><strong>Rechtsgrundlagen:</strong> Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO).</span></li>
          <li><strong>Profile der Nutzer sind nicht öffentlich: </strong>Die Profile der Nutzer sind öffentlich nicht sichtbar und nicht zugänglich.</li>
        </ul>
        
        <p className="mElements">
          <a 
            href="https://datenschutz-generator.de/" 
            title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." 
            target="_blank" 
            rel="noopener noreferrer nofollow"
          >
            Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke
          </a>
        </p>
      </main>
      
      <Footer />
    </>
  );
}