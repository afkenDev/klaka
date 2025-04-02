import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
  try {
    // ✅ Nur EINMAL req.json() aufrufen
    const payload = await req.json();
    const { klassenname, vorname, nachname, color, userId } = payload;

    console.log("Empfangene Daten:", payload);

    // 1️⃣ Klasse einfügen
    const { data: insertedClass, error: insertError } = await supabase
      .from('klasse')
      .insert([{ klassenname, vorname, nachname, color }])
      .select()
      .single();

    if (insertError) throw insertError;

    const klasseId = insertedClass.id;

    // 2️⃣ Verknüpfen mit user
    const { error: linkError } = await supabase
      .from('user_klasse')
      .insert([{ user_id: userId, klasse_id: klasseId }]);

    if (linkError) throw linkError;

    return NextResponse.json(
      { message: 'Klasse + Verbindung erfolgreich gespeichert.', data: insertedClass },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Klassen-Erstellen:", error);
    return NextResponse.json({ message: error.message || "Unbekannter Fehler" }, { status: 400 });
  }

  
}