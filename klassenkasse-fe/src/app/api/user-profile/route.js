import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId und role sind erforderlich.' }, { status: 400 });
    }

    const { error } = await supabase
        .from('user_profile')
        .upsert({ id: userId, role_id: role }); // wenn `role` z. B. 1 oder 2 (ID aus `rollen`)
    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Fehler beim Speichern der Rolle.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Rolle gespeichert.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
