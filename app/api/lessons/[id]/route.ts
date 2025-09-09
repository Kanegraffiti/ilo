import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { lessonIdParam } from '../../../../lib/zodSchemas';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const parse = lessonIdParam.safeParse(params);
  if (!parse.success) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  const supabase = supabaseServer();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', params.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data: media } = await supabase.from('lesson_media').select('*').eq('lesson_id', params.id);
  const { data: vocab } = await supabase.from('vocab').select('*').eq('lesson_id', params.id);
  return NextResponse.json({ lesson, media, vocab });
}
