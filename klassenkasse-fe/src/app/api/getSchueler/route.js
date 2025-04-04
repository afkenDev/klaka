import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST() {
    const { data: schueler, error: schuelerError } = await supabase
        .from("schueler")
        .select("*"); // Alle Schüler abrufen (ohne Filter)

    if (schuelerError) {
        return NextResponse.json({ error: schuelerError.message }, { status: 500 });
    }

    return NextResponse.json(schueler, { status: 200 });
}
