// File: /api/sql/route.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient, supabase as adminSupabase } from '../../lib/supabaseClient';

export async function POST(req) {
  try {
    // Token aus der Anfrage extrahieren
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json({ error: 'Token fehlt' }, { status: 401 });
    }
    
    // Supabase-Client mit dem Token erstellen
    const supabase = createSupabaseServerClient(token);
    
    // Authentifizierten Benutzer abrufen
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }
    
    // Prüfen, ob Benutzer Admin ist
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('role_id')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return NextResponse.json({ error: 'Fehler beim Abrufen des Benutzerprofils' }, { status: 500 });
    }
      
    if (!profile || profile.role_id !== 2) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
    }
    
    // Query aus der Anfrage holen
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Ungültige Abfrage' }, { status: 400 });
    }
    
    // SQL-Befehl mit der Funktion ausführen
    const { data, error } = await supabase.rpc('execute_sql', { sql: query });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('SQL Ausführungsfehler:', err);
    return NextResponse.json({ error: 'Interner Serverfehler: ' + err.message }, { status: 500 });
  }
}