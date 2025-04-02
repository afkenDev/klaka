import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
  try {
    const { userId, klasseId } = await req.json();

    if (!userId || !klasseId) {
      return NextResponse.json({ error: 'userId und klasseId sind erforderlich.' }, { status: 400 });
    }

    const { error } = await supabase
        .from('user_klasse')
        .insert([{ user_id: userId, klasse_id: klasseId }]); // <-- Array!
      if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Fehler beim Speichern der Klassen-Zuordnung.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Klasse zugewiesen.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
