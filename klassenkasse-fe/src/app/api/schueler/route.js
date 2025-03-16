import { supabase } from '../../lib/supabaseClient.js';
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
            const formData = await req.formData();
            const file = formData.get('file');

            if (!file) throw new Error('Keine Datei hochgeladen');

            const buffer = await file.arrayBuffer(); // Nutze arrayBuffer statt FileReader
            const wb = XLSX.read(buffer, { type: 'array' });

            const sheet = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet);

            // Spaltennamen umbenennen, um mit der Tabelle übereinzustimmen
            const renamedData = data.map((item) => ({
                name: item.Vorname, // 'Vorname' zu 'name'
                surname: item.Nachname, // 'Nachname' zu 'surname'
                mobile: item.Mobile, // 'Mobile' zu 'mobile'
                mail: item.EMail, // 'EMail' zu 'mail'
                class: item.Klasse // 'Klasse' zu 'class'
            }));

            // Jetzt die umbenannten Daten in die Datenbank einfügen
            const { data: insertedData, error } = await supabase
                .from('schueler')
                .insert(renamedData)
                .select('*');

            if (error) throw error;

            return new Response(JSON.stringify({ message: 'Schüler erfolgreich importiert', data: insertedData }), { status: 200 });

        }

        throw new Error('Unbekannter Inhaltstyp'); // Wenn der Inhaltstyp nicht bekannt ist
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 400 });
    }
}
