
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ejvfjqsvlvoffaaecsuc.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Dein Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseKey)

