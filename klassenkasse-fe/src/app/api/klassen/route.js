import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseClient'; // passt den Pfad ggf. an

export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);
    console.log("token: ", token)
    // Holen des aktuellen Benutzers aus dem Token
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ message: 'User nicht gefunden' }, { status: 401 });
    }
    console.log("user, ", user);
    console.log("user, ", user.user.id);
    const payload = await req.json();
    const { klassenname, vorname, nachname, color } = payload;
    console.log("payload: ", payload);

    // ✅ 1. Klasse mit user_id = auth.uid() einfügen
    const { data: insertedClass, error: insertError } = await supabase
      .from('klasse')
      .insert([{ klassenname, vorname, nachname, color, user_id: user.user.id }]) // Verwende user.id
      .select()
      .single();
    console.log("insertedData: ", insertedClass)
    if (insertError) throw insertError;

    // 📎 2. user_klasse-Eintrag erstellen
    const klasseId = insertedClass.id;

    const { error: linkError } = await supabase
      .from('user_klasse')
      .insert([{ user_id: user.user.id, klasse_id: klasseId }]); // Verwende user.id

    if (linkError) throw linkError;

    return NextResponse.json(
      { message: 'Klasse erfolgreich erstellt', data: insertedClass },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fehler beim Klassen-Erstellen:', error);
    return NextResponse.json({ message: error.message || 'Unbekannter Fehler' }, { status: 400 });
  }
}
