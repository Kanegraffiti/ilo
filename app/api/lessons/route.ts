import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('lessons')
    .select('id,title,module_id,modules(title)')
    .eq('status', 'Published')
    .order('order_index');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
