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

        const { data: schueler, error: schuelerError } = await supabaseServer
            .from('schueler')
            .select('*'); // Optional: Du könntest hier auch filtern, falls nötig

        if (schuelerError) {
            return NextResponse.json({ error: schuelerError.message }, { status: 500 });
        }

        return NextResponse.json(schueler, { status: 200 });

    } catch (err) {
        console.error('Fehler in /api/getSchueler:', err);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}
