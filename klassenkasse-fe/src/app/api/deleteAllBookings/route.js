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

        // 1. Hole alle Schüler-IDs der Klasse
        const { data: schuelerData, error: schuelerError } = await supabase
            .from('schueler')
            .select('id')
            .eq('class', classId);

        if (schuelerError) {
            return NextResponse.json({ error: schuelerError.message }, { status: 500 });
        }

        const schuelerIds = schuelerData.map(s => s.id);

        if (schuelerIds.length === 0) {
            return NextResponse.json({ message: 'Keine Schüler in der Klasse' }, { status: 200 });
        }

        // 2. Hole alle balance_id, die mit den Schülern verknüpft sind
        const { data: schuelerBalanceData, error: sbError } = await supabase
            .from('schueler_balance')
            .select('balance_id')
            .in('schueler_id', schuelerIds);

        if (sbError) {
            return NextResponse.json({ error: sbError.message }, { status: 500 });
        }

        const balanceIds = schuelerBalanceData.map(sb => sb.balance_id);

        // 3. Lösche Einträge aus schueler_balance
        await supabase
            .from('schueler_balance')
            .delete()
            .in('schueler_id', schuelerIds);

        // 4. Lösche die verknüpften Buchungen
        if (balanceIds.length > 0) {
            await supabase
                .from('balance')
                .delete()
                .in('id', balanceIds);
        }

        const { error: updateError } = await supabase
            .from('klasse')
            .update({ lastActivity: new Date().toISOString() })
            .eq('id', classId);

        if (updateError) throw updateError;

        return NextResponse.json({ message: 'Nur Buchungen gelöscht' }, { status: 200 });
    } catch (error) {
        console.error('Löschfehler:', error);
        return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
    }
}
