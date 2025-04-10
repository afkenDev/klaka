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

        const { classId } = await req.json();

        if (!classId) {
            return NextResponse.json({ error: 'classId fehlt' }, { status: 400 });
        }

        const supabaseServer = createSupabaseServerClient(token);

        const { data: balance, error } = await supabaseServer
            .from('balance')
            .select('id, name, amount, date, updated_at, operator, class_id')
            .eq('class_id', classId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(balance, { status: 200 });

    } catch (err) {
        console.error("Fehler in /api/getBalance:", err);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}
