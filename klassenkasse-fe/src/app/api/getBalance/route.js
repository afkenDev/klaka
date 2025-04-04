import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function POST(req) {
    const { classId } = await req.json();

    if (!classId) {
        return NextResponse.json({ error: "classId fehlt" }, { status: 400 });
    }

    const { data: balance, error } = await supabase
        .from("balance")
        .select("id, name, amount, date, updated_at, operator, class_id")
        .eq("class_id", classId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(balance, { status: 200 });
}
