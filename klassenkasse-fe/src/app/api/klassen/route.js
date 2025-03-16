import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient.js';

export async function POST(req) {
    try {
        const { klassenname, vorname, nachname, color } = await req.json();

        // Einfügen der Klasse
        const { data: insertData, error } = await supabase
            .from('klasse')
            .insert([{ klassenname, vorname, nachname, color }])
            .select(); // .select() sorgt dafür, dass die eingefügten Daten zurückgegeben werden

        if (error) throw error;

        console.log("Eingefügte Daten: ", insertData);
        return NextResponse.json({ message: 'Klasse hinzugefügt', data: insertData }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

