import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient';
import jwt from 'jsonwebtoken';  // Importiere die JWT-Bibliothek

export async function POST(req) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Token fehlt' }, { status: 400 });
        }

        // Dekodiere das Token, um die user_id zu extrahieren
        const decoded = jwt.decode(token);
        const userId = decoded?.sub;  // `sub` ist normalerweise die Benutzer-ID im JWT

        if (!userId) {
            return NextResponse.json({ error: 'Benutzer-ID konnte nicht extrahiert werden' }, { status: 400 });
        }

        const supabaseServer = createSupabaseServerClient(token);


        // Abrufen aller Klassen-IDs für den Benutzer
        const { data: userKlasseData, error: userKlasseError } = await supabaseServer
            .from('user_klasse')
            .select('klasse_id')
            .eq('user_id', userId);  // Alle Klassen-IDs des Benutzers abrufen


        if (userKlasseError) {
            console.error('Fehler beim Abrufen der Klassen des Benutzers:', userKlasseError);
            throw userKlasseError;
        }


        // Alle Klassen-IDs sammeln
        const klasseIds = userKlasseData.map(item => item.klasse_id);


        // Abrufen der Schüler-Daten für alle Klassen des Benutzers
        const { data: schueler, error: schuelerError } = await supabaseServer
            .from('schueler')
            .select('*')
            .in('class', klasseIds);  // Filtere nach den Klassen-IDs


        if (schuelerError) {
            console.error('Fehler beim Abrufen der Schüler:', schuelerError);
            throw schuelerError;
        }

        // Abrufen der Balance-Daten für die Schüler
        const { data: balances, error: balanceError } = await supabaseServer
            .from('schueler_balance')
            .select('schueler_id, balance:balance_id(*)')
            .in('schueler_id', schueler.map(sch => sch.id));  // Filtere nach den Schülern

        if (balanceError) {
            console.error('Fehler beim Abrufen der Balance-Daten:', balanceError);
            throw balanceError;
        }

        // Verknüpfe die Schüler mit den Balance-Daten
        const schuelerMitBalance = schueler.map(sch => ({
            ...sch,
            balance: balances.filter(b => b.schueler_id === sch.id).map(b => b.balance),
        }));

        return NextResponse.json(schuelerMitBalance, { status: 200 });

    } catch (error) {
        console.error("Fehler in /api/getSchuelerMitBalance:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
