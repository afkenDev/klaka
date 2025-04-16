import { createSupabaseServerClient } from '../../lib/supabaseClient';
import * as XLSX from 'xlsx';

// 🔧 Hilfsfunktion zum Ersetzen von Umlauten
function replaceUmlauts(str) {
    return str
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss');
}

export async function POST(req) {
    try {
        const contentType = req.headers.get('Content-Type') || '';
        const token = req.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
        }

        const supabase = createSupabaseServerClient(token);

        // 🔹 JSON-Request: einzelner Schüler hinzufügen
        if (contentType.includes('application/json')) {
            const { name, surname, mobile, class: studentClass } = await req.json();

            const mail = `${replaceUmlauts(name)}.${replaceUmlauts(surname)}@stud.kbw.ch`;

            const { data, error } = await supabase
                .from('schueler')
                .insert([{ name, surname, mobile, mail, class: studentClass }])
                .select();

            if (error) throw error;

            const { error: updateError } = await supabase
                .from('klasse')
                .update({ lastActivity: new Date().toISOString() })
                .eq('id', studentClass);

            if (updateError) throw updateError;

            return new Response(
                JSON.stringify({ message: 'Schüler hinzugefügt', data: data }),
                { status: 200 }
            );
        }

        // 🔹 Excel-Import
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file');
            const classId = formData.get('classId');

            if (!file || !classId) throw new Error('Datei oder Klassen-ID fehlt');

            const buffer = await file.arrayBuffer();
            const wb = XLSX.read(buffer, { type: 'array' });

            const sheet = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet);

            const renamedData = [];

            for (const item of data) {
                renamedData.push({
                    name: item.Vorname,
                    surname: item.Nachname,
                    mobile: item.Mobile,
                    mail:
                        item.EMail ||
                        `${replaceUmlauts(item.Vorname)}.${replaceUmlauts(item.Nachname)}@stud.kbw.ch`,
                    class: classId,
                });
            }

            const { data: insertedData, error } = await supabase
                .from('schueler')
                .insert(renamedData)
                .select('*');

            if (error) throw error;

            const { error: updateError } = await supabase
                .from('klasse')
                .update({ lastActivity: new Date().toISOString() })
                .eq('id', classId);

            if (updateError) throw updateError;

            return new Response(
                JSON.stringify({
                    message: 'Schüler erfolgreich importiert',
                    data: insertedData,
                }),
                { status: 200 }
            );
        }

        throw new Error('Unbekannter Inhaltstyp');
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: 400,
        });
    }
}
