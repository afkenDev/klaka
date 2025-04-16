// pages/api/getKlasseById.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient'; // ggf. Pfad anpassen

export async function POST(req) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Token fehlt' }, { status: 401 });
        }

        const supabase = createSupabaseServerClient(token);
        const { classId } = await req.json();

        if (!classId) {
            return NextResponse.json({ error: 'classId fehlt' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('klasse')
            .select('*')
            .eq('id', classId)
            .single();

        if (error) {
            console.error('Fehler beim Datenbankzugriff:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('Fehler im Catch:', err);
        return NextResponse.json({ error: 'Unbekannter Fehler' }, { status: 500 });
    }
}
