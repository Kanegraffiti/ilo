import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { submissionSchema } from '../../../lib/zodSchemas';

export async function POST(req: Request) {
  const body = await req.json();
  const parse = submissionSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const supabase = supabaseServer();
  const { data, error } = await supabase.from('submissions').insert({
    id: parse.data.id,
    lesson_id: parse.data.lesson_id,
    type: parse.data.type,
    payload: parse.data.payload,
    media_path: parse.data.media_path,
    score: parse.data.score,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
