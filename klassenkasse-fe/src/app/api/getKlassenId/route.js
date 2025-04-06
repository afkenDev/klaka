import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
    try {
        const { klassenname } = await req.json();

        if (!klassenname) {
            return NextResponse.json({ error: 'Kein Klassenname übergeben' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('klasse')
            .select('id')
            .eq('klassenname', klassenname)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Klasse nicht gefunden' }, { status: 404 });
        }

        return NextResponse.json({ id: data.id }, { status: 200 });

    } catch (err) {
        console.error("Fehler in getKlassenId:", err);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}
