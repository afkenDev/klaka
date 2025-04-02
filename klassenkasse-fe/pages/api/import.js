import { supabase } from '../../src/app/lib/supabaseClient.js';
import * as XLSX from 'xlsx';

export async function POST(req) {
    try {
        // Überprüfe den Inhalt der Anfrage, um zu entscheiden, ob es sich um einen Import oder eine Schülererstellung handelt
        const contentType = req.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
            // Wenn es sich um eine normale JSON-Anfrage handelt (Schüler hinzufügen)
            const { name, surname, mobile, class: studentClass } = await req.json();

            const mail = `${name.toLowerCase()}.${surname.toLowerCase()}@stud.kbw.ch`;
            const { data, error } = await supabase
                .from('schueler')
                .insert([{ name, surname, mobile, mail, class: studentClass }])
                .select();

            if (error) throw error;

            return new Response(JSON.stringify({ message: 'Schüler hinzugefügt', data: data }), { status: 200 });
        }

        if (contentType.includes('multipart/form-data')) {
            // Wenn es sich um einen Dateiupload handelt (Import)
            const formData = await req.formData(); // formData wird verwendet, um eine Datei zu erhalten
            const file = formData.get('file'); // holt die Datei aus dem FormData

            if (!file) throw new Error('Keine Datei hochgeladen'); // Fehlerbehandlung, falls keine Datei vorhanden ist

            const reader = new FileReader();
            reader.onload = async () => {
                const wb = XLSX.read(reader.result, { type: 'binary' });

                const sheet = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(sheet);

                const { data: insertedData, error } = await supabase
                    .from('schueler')
                    .insert(data.map(item => ({
                        name: item.Nachname,
                        surname: item.Vorname,
                        mobile: item.Mobile,
                        mail: item.EMail,
                        class: item.Klasse
                    })));

                if (error) throw error;

                return new Response(JSON.stringify({ message: 'Schüler erfolgreich importiert', data: insertedData }), { status: 200 });
            };

            reader.readAsBinaryString(file); // Startet das Einlesen der Datei
        }

        throw new Error('Unbekannter Inhaltstyp'); // Wenn der Inhaltstyp nicht bekannt ist
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }
}
