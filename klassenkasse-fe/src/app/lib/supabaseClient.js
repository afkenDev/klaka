import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Für Admin-Zugriff, nur auf dem Server nutzen!

// Standard-Client für Client-seitige Verwendung
export const supabase = createClient(supabaseUrl, anonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Funktion für Server-seitige Requests mit User-Token (z.B. in API-Routen)
export function createSupabaseServerClient(token) {
    return createClient(supabaseUrl, anonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
}
