import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function GET(req, { params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('schueler')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const updatedStudent = await req.json();

    // Hole die aktuellen Schülerdaten
    const { data: currentData, error: fetchError } = await supabase
        .from('schueler')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });

    // Vergleiche die aktuellen Daten mit den neuen Daten und extrahiere nur die geänderten Felder
    const updatedFields = {};
    for (const key in updatedStudent) {
        if (updatedStudent[key] !== currentData[key]) {
            updatedFields[key] = updatedStudent[key]; // Füge nur die geänderten Felder hinzu
        }
    }

    // Führe das Update aus
    const { data, error } = await supabase
        .from('schueler')
        .update(updatedFields)  // Nur geänderte Felder werden übergeben
        .eq('id', id)
        .select('*');  // Oder wähle spezifische Felder aus, wenn du nicht alle willst

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Gebe nur die geänderten Daten zurück
    return NextResponse.json({ message: 'Schüler erfolgreich aktualisiert', data: updatedFields }, { status: 200 });
}

export async function DELETE(req, { params }) {
    const { id } = await params;

    // Zuerst alle Einträge aus der schueler_balance-Tabelle löschen
    const { error: balanceError } = await supabase
        .from('schueler_balance')
        .delete()
        .eq('schueler_id', id);

    if (balanceError) return NextResponse.json({ error: balanceError.message }, { status: 400 });

    // Danach den Schüler löschen
    const { error: schuelerError } = await supabase
        .from('schueler')
        .delete()
        .eq('id', id);

    if (schuelerError) return NextResponse.json({ error: schuelerError.message }, { status: 400 });

    return NextResponse.json({ message: 'Schüler und zugehörige Balance-Einträge erfolgreich gelöscht' }, { status: 200 });
}

