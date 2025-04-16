import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient'; // Pfad ggf. anpassen

export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token fehlt' }, { status: 400 });
    }

    const supabaseServer = createSupabaseServerClient(token);

    const { data, error } = await supabaseServer
      .from('user_klasse')
      .select('klasse(*)');

    if (error) {
      console.error("Fehler beim Select:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const klassen = data.map((entry) => entry.klasse);


    return NextResponse.json(klassen, { status: 200 });
  } catch (err) {
    console.error('Fehler im Catch:', err);
    return NextResponse.json({ error: 'Unbekannter Fehler' }, { status: 500 });
  }
}
