import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST() {
    try {
        // Schüler-Daten abrufen
        const { data: schueler, error: schuelerError } = await supabase
            .from("schueler")
            .select("*");

        if (schuelerError) throw schuelerError;

        // Balance-Daten abrufen und mit Schülern verknüpfen
        const { data: balances, error: balanceError } = await supabase
            .from("schueler_balance")
            .select("schueler_id, balance:balance_id(*)");

        if (balanceError) throw balanceError;
        console.log("daata, ", balances);
        // Schüler mit Balances verbinden
        const schuelerMitBalance = schueler.map(sch => ({
            ...sch,
            balance: balances.filter(b => b.schueler_id === sch.id).map(b => b.balance)
        }));

        return NextResponse.json(schuelerMitBalance, { status: 200 });

    } catch (error) {
        console.error("Fehler in /api/getSchuelerMitBalance:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
