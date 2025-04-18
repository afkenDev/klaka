import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabaseClient';

export async function DELETE(req, { params }) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);


    const { id } = params; // balance_id

    // Zuerst die balance-Daten abfragen, um die class_id zu erhalten
    const { data: balanceData, error: balanceFetchError } = await supabase
        .from('balance')
        .select('class_id') // Wir holen nur das "class_id"-Attribut
        .eq('id', id)
        .single();

    if (balanceFetchError) {
        return NextResponse.json({ error: balanceFetchError.message }, { status: 400 });
    }

    const class_id = balanceData.class_id; // Extrahiere class_id aus den Balance-Daten

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

    // Aktualisiere die `klasse`-Tabelle mit dem neuen Timestamp
    const { error: updateError } = await supabase
        .from('klasse')
        .update({ lastActivity: new Date().toISOString() })
        .eq('id', class_id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    return NextResponse.json({ message: 'Buchung und zugehörige Einträge erfolgreich gelöscht' }, { status: 200 });
}


export async function PUT(req, { params }) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);


    const { id } = await params;
    const { name, amount, date, operator, fach } = await req.json();

    // Hole die balance-Daten, um die class_id zu bekommen
    const { data: balanceData, error: balanceFetchError } = await supabase
        .from('balance')
        .select('class_id') // Wir holen nur das "class_id"-Attribut
        .eq('id', id)
        .single();

    if (balanceFetchError) {
        return NextResponse.json({ error: balanceFetchError.message }, { status: 400 });
    }

    const class_id = balanceData.class_id; // Extrahiere class_id aus den Balance-Daten

    // Führe das Update der balance-Tabelle durch
    const { error } = await supabase
        .from("balance")
        .update({ name, amount, date, operator, fach })
        .eq("id", id);

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

    return NextResponse.json({ message: "Buchung erfolgreich aktualisiert" }, { status: 200 });
}

