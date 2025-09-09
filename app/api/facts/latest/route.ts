import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('fun_facts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data?.[0] || null);
}
