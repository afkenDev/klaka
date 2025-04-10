import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Token fehlt' }, { status: 400 });
        }

        const decoded = jwt.decode(token);
        const userId = decoded?.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Benutzer-ID konnte nicht extrahiert werden' }, { status: 400 });
        }

        const supabaseServer = createSupabaseServerClient(token);
        const { klassenname } = await req.json();

        if (!klassenname) {
            return NextResponse.json({ error: 'Kein Klassenname übergeben' }, { status: 400 });
        }

        const { data, error } = await supabaseServer
            .from('klasse')
            .select('id')
            .eq('klassenname', klassenname)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Klasse nicht gefunden' }, { status: 404 });
        }

        return NextResponse.json({ id: data.id }, { status: 200 });

    } catch (err) {
        console.error("Fehler in /api/getKlassenId:", err);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}
