import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient';

// API-Route für das Löschen eines Eintrags in schueler_balance
export async function DELETE(req) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);


    try {
        const body = await req.json();
        const { schueler_id, balance_id } = body;

        if (!schueler_id || !balance_id) {
            return NextResponse.json({ error: "Fehlende Parameter" }, { status: 400 });
        }

        // Hole die class_id aus der balance-Tabelle
        const { data: balanceData, error: balanceFetchError } = await supabase
            .from('balance')
            .select('class_id') // Wir holen nur das "class_id"-Attribut
            .eq('id', balance_id)
            .single();

        if (balanceFetchError) {
            return NextResponse.json({ error: balanceFetchError.message }, { status: 400 });
        }

        const class_id = balanceData.class_id; // Extrahiere class_id aus den Balance-Daten

        // Lösche den Eintrag aus der schueler_balance-Tabelle
        const { error } = await supabase
            .from("schueler_balance")
            .delete()
            .eq("schueler_id", schueler_id)
            .eq("balance_id", balance_id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Aktualisiere die `klasse`-Tabelle mit dem neuen Timestamp
        const { error: updateError } = await supabase
            .from('klasse')
            .update({ lastActivity: new Date().toISOString() })
            .eq('id', class_id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        return NextResponse.json({ message: "Buchung erfolgreich gelöscht" }, { status: 200 });
    } catch (error) {
        console.error("API-Fehler:", error);
        return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
    }
}
