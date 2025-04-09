import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: 'E-Mail fehlt' }), { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const userExists = data.users.some((user) => user.email.toLowerCase() === email.toLowerCase());

  return new Response(JSON.stringify({ userExists }), { status: 200 });
}
