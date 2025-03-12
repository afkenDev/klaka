
import { createClient } from '@supabase/supabase-js'



const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Gefunden ✅" : "Nicht gefunden ❌");

export const supabase = createClient(supabaseUrl, supabaseKey)

