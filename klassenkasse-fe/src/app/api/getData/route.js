import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
  const { userId } = await req.json();

  const { data, error } = await supabase
    .from('user_klasse')
    .select('klasse(*)') // Lade die verknüpfte Klasse!
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Extrahiere nur die Klasse(n)
  const klassen = data.map((entry) => entry.klasse);
  return NextResponse.json(klassen, { status: 200 });
}
