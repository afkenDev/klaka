import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('klasse')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
}
