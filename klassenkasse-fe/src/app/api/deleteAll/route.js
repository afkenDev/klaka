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
        const body = await req.json();
        const { classId } = body;

        if (!classId) {
            return NextResponse.json({ error: 'Klassen-ID fehlt' }, { status: 400 });
        }

        // 1. Alle Schüler der Klasse holen
        const { data: schuelerData, error: schuelerError } = await supabase
            .from('schueler')
            .select('id')
            .eq('class', classId);

        if (schuelerError) {
            return NextResponse.json({ error: schuelerError.message }, { status: 500 });
        }

        const schuelerIds = schuelerData.map(s => s.id);

        // 2. Alle balance_ids über schueler_balance ermitteln
        let balanceIds = [];
        if (schuelerIds.length > 0) {
            const { data: sbData, error: sbError } = await supabase
                .from('schueler_balance')
                .select('balance_id')
                .in('schueler_id', schuelerIds);

            if (sbError) {
                return NextResponse.json({ error: sbError.message }, { status: 500 });
            }

            balanceIds = sbData.map(b => b.balance_id);
        }

        // 3. Löschen: schueler_balance
        if (schuelerIds.length > 0) {
            await supabase
                .from('schueler_balance')
                .delete()
                .in('schueler_id', schuelerIds);
        }

        // 4. Löschen: balance
        if (balanceIds.length > 0) {
            await supabase
                .from('balance')
                .delete()
                .in('id', balanceIds);
        }

        // 5. Löschen: schueler
        if (schuelerIds.length > 0) {
            await supabase
                .from('schueler')
                .delete()
                .in('id', schuelerIds);
        }
        // 6. Löschen: alle Verknüpfungen in der Tabelle user_klasse
        await supabase
            .from('user_klasse')
            .delete()
            .eq('klasse_id', classId); // Wenn der Foreign Key auf 'klasse_id' verweist

        // 7. Löschen: die Klasse selbst
        const { error: classDeleteError } = await supabase
            .from('klasse')
            .delete()
            .eq('id', classId);






        if (classDeleteError) {
            return NextResponse.json({ error: classDeleteError.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Alles gelöscht (inkl. Klasse)' }, { status: 200 });

    } catch (error) {
        console.error('Fehler beim vollständigen Löschen:', error);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}
