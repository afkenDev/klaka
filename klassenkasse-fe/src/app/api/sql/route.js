// Datei: app/api/sql/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Nur serverseitig laden!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { query } = await req.json();

  try {
    const { data, error } = await supabase.rpc('execute_sql', { sql: query });

    if (error) throw error;
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
