// app/api/invite/route.js

import { createClient } from '@supabase/supabase-js';

// Erstelle einen Supabase-Client mit deinem Service Role Key
// Der Service Key sollte NICHT als NEXT_PUBLIC_ veröffentlicht werden!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Keine E-Mail übermittelt.' }),
        { status: 400 }
      );
    }

    // 1. Sende die Einladung an den Benutzer
const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/login/set-password`,
});l

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400 }
      );
    }

    // 2. Hole die User-ID aus den Daten
    const userId = data?.user?.id;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Benutzer-ID nicht gefunden.' }),
        { status: 500 }
      );
    }

    // 3. Setze das user_metadata-Flag, damit wir wissen, dass der Benutzer noch ein Passwort setzen muss
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        mustSetPassword: true,
      },
    });

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Benutzer wurde eingeladen, aber Metadaten konnten nicht gesetzt werden.' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Einladung erfolgreich gesendet & Markierung gesetzt.' }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
