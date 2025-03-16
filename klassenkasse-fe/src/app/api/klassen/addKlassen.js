// pages/api/klassen.js
import supabase from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Neue Klasse aus der Anfrage extrahieren
        const { klassenname, nachname, vorname, color } = req.body;

        try {
            // Klasse in die Supabase-Datenbank einfügen
            const { data, error } = await supabase
                .from('klassen')  // Tabelle 'klassen' in Supabase
                .insert([{ klassenname, nachname, vorname, color }]);

            if (error) {
                return res.status(400).json({ message: error.message });
            }

            // Erfolgreiche Antwort
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        // Nur POST-Requests erlauben
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
