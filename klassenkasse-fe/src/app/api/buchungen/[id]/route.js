import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient.js';

export async function DELETE(req, { params }) {
    const { id } = params; // balance_id

    // Zuerst alle Einträge aus der schueler_balance-Tabelle löschen
    const { error: schuelerBalanceError } = await supabase
        .from('schueler_balance')
        .delete()
        .eq('balance_id', id);

    if (schuelerBalanceError) {
        return NextResponse.json({ error: schuelerBalanceError.message }, { status: 400 });
    }

    // Danach den Eintrag aus der balance-Tabelle löschen
    const { error: balanceError } = await supabase
        .from('balance')
        .delete()
        .eq('id', id);

    if (balanceError) {
        return NextResponse.json({ error: balanceError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Buchung und zugehörige Einträge erfolgreich gelöscht' }, { status: 200 });
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const { name, amount, date, operator } = await req.json();

    const { error } = await supabase
        .from("balance")
        .update({ name, amount, date, operator })
        .eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Buchung erfolgreich aktualisiert" }, { status: 200 });
}
