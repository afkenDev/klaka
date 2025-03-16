import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient.js';

export async function POST(req) {
    try {
        const { name, amount, date, students, operator } = await req.json();

        if (!name || !amount || !date || !operator || !students || students.length === 0) {
            return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 });
        }

        // 1️⃣ Buchung mit Operator in balance-Tabelle speichern
        const { data: balanceEntry, error: balanceError } = await supabase
            .from('balance')
            .insert([{ name, amount, date, operator }]) // Operator hinzufügen
            .select()
            .single(); // Einzelnen Eintrag abrufen

        if (balanceError) {
            console.error('Fehler beim Speichern der Buchung:', balanceError);
            return NextResponse.json({ error: 'Fehler beim Speichern der Buchung.' }, { status: 500 });
        }

        const balanceId = balanceEntry.id; // ID der erstellten Buchung

        // 2️⃣ Verknüpfungen in der schueler_balance-Tabelle speichern
        const schuelerBalanceEntries = students.map(schuelerId => ({
            schueler_id: schuelerId,
            balance_id: balanceId,
        }));

        const { error: schuelerBalanceError } = await supabase
            .from('schueler_balance')
            .insert(schuelerBalanceEntries);

        if (schuelerBalanceError) {
            console.error('Fehler beim Speichern der Schüler-Zuordnung:', schuelerBalanceError);
            return NextResponse.json({ error: 'Fehler beim Speichern der Schüler-Zuordnung.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Buchung erfolgreich gespeichert!', balanceId }, { status: 201 });

    } catch (error) {
        console.error('Server-Fehler:', error);
        return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
    }
}
