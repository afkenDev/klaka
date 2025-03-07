// pages/api/getData.js
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('klasse') // Ersetze '' mit deinem Tabellen-Namen
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}
