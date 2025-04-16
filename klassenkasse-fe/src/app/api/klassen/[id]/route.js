// app/api/klasse/[id]/route.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabaseClient';

export async function PUT(req, { params }) {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ message: 'Token fehlt' }, { status: 401 });
    }

    const supabase = createSupabaseServerClient(token);
    const { id } = await params;
    const updatedClass = await req.json();

    const { data: currentData, error: fetchError } = await supabase
        .from('klasse')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 400 });

    const updatedFields = {};
    for (const key in updatedClass) {
        if (updatedClass[key] !== currentData[key]) {
            updatedFields[key] = updatedClass[key];
        }
    }

    const { data, error } = await supabase
        .from('klasse')
        .update(updatedFields)
        .eq('id', id)
        .select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: 'Klasse erfolgreich aktualisiert', data: updatedFields }, { status: 200 });
}
