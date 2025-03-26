import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient.js';

export async function POST(req) {
    try {
        const { name, amount, date, students, operator, class_id } = await req.json();

        if (!name || !amount || !date || !operator || !students || students.length === 0 || !class_id) {
            return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 });
        }

        // 1️⃣ Buchung mit class_id in balance-Tabelle speichern
        const { data: balanceEntry, error: balanceError } = await supabase
            .from('balance')
            .insert([{ name, amount, date, operator, class_id }])
            .select()
            .single();

        if (balanceError) {
            console.error('Fehler beim Speichern der Buchung:', balanceError);
            return NextResponse.json({ error: 'Fehler beim Speichern der Buchung.' }, { status: 500 });
        }

        const balanceId = balanceEntry.id;

        // 2️⃣ Verknüpfungen in schueler_balance speichern
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

        return NextResponse.json({
            message: 'Buchung erfolgreich gespeichert!',
            data: [balanceEntry]
        }, { status: 201 });

    } catch (error) {
        console.error('Server-Fehler:', error);
        return NextResponse.json({ error: 'Interner Server-Fehler' }, { status: 500 });
    }
}

