import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient';

export async function DELETE(req) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);
    console.log("token: ", token)

    try {
        const { classId } = await req.json();

        if (!classId) {
            return NextResponse.json({ error: "classId fehlt" }, { status: 400 });
        }

        // Alle Schüler dieser Klasse holen
        const { data: schueler, error: schuelerError } = await supabase
            .from('schueler')
            .select('id')
            .eq('class', classId);

        if (schuelerError) throw new Error(schuelerError.message);

        const schuelerIds = schueler.map(s => s.id);

        // Alle balances dieser Klasse holen
        const { data: balances, error: balanceError } = await supabase
            .from('balance')
            .select('id')
            .eq('class_id', classId);

        if (balanceError) throw new Error(balanceError.message);

        const balanceIds = balances.map(b => b.id);

        // 1. Zwischentabelle löschen
        await supabase
            .from('schueler_balance')
            .delete()
            .in('schueler_id', schuelerIds);

        await supabase
            .from('schueler_balance')
            .delete()
            .in('balance_id', balanceIds);

        // 2. Schüler löschen
        await supabase
            .from('schueler')
            .delete()
            .in('id', schuelerIds);

        // 3. Balance löschen
        await supabase
            .from('balance')
            .delete()
            .in('id', balanceIds);

        return NextResponse.json({ message: 'Alles wurde erfolgreich gelöscht' }, { status: 200 });

    } catch (error) {
        console.error("Fehler beim Löschen der Klassendaten:", error);
        return NextResponse.json({ error: error.message || "Interner Serverfehler" }, { status: 500 });
    }
}
