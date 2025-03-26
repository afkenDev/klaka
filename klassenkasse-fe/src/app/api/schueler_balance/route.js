import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient.js';

// API-Route für das Löschen eines Eintrags in schueler_balance
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { schueler_id, balance_id } = body;

        if (!schueler_id || !balance_id) {
            return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 });
        }

        const { error } = await supabase
            .from("schueler_balance")
            .delete()
            .eq("schueler_id", schueler_id)
            .eq("balance_id", balance_id); // ID der Balance prüfen!

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Buchung erfolgreich gelöscht" }, { status: 200 });
    } catch (error) {
        console.error("API-Fehler:", error);
        return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
    }
}