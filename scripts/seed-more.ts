import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

async function run() {
  const modules = [
    { title: 'Greetings' },
    { title: 'Family' },
  ];
  const moduleIds: string[] = [];
  for (const m of modules) {
    const { data } = await supabase
      .from('modules')
      .insert(m)
      .select('id')
      .single();
    if (data) moduleIds.push(data.id);
  }
  const lessonsData = [
    {
      title: 'Hello and Welcome',
      notes_md: '## Pẹ́lẹ́ o\nBasic greetings in Yorùbá.',
      objectives: ['Say hello', 'Respond to greetings'],
      vocab: [
        ['Pẹ́lẹ́', 'Hello'],
        ['Báwo ni?', 'How are you?'],
        ['Ẹ káàárọ̀', 'Good morning'],
        ['Ẹ káàsán', 'Good afternoon'],
        ['Ẹ káalẹ́', 'Good evening'],
        ['O dàbọ̀', 'Goodbye'],
      ],
    },
    {
      title: 'Introducing Yourself',
      notes_md: '## Orúkọ\nTalk about names.',
      objectives: ['State your name', 'Ask for names'],
      vocab: [
        ['Orúkọ', 'Name'],
        ['Tàlò jẹ?', 'Who is it?'],
        ['Emi ni...', 'I am...'],
        ['Ìwọ n kọ?', 'And you?'],
        ['Láti pàdé ẹ', 'Nice to meet you'],
        ['Ẹ sọ òun', 'Say it'],
      ],
    },
    {
      title: 'Family Members',
      notes_md: '## Ẹbí\nTalking about family.',
      objectives: ['Name family members', 'Describe relations'],
      vocab: [
        ['Bàbá', 'Father'],
        ['Ìyá', 'Mother'],
        ['Àbúrò', 'Younger sibling'],
        ['Ègbón', 'Older sibling'],
        ['Ọmọ', 'Child'],
        ['Ọkùnrin', 'Man'],
      ],
    },
  ];
  for (const modId of moduleIds) {
    for (const lesson of lessonsData) {
      const { data: lrow } = await supabase
        .from('lessons')
        .insert({
          module_id: modId,
          title: lesson.title,
          notes_md: lesson.notes_md,
          objectives: lesson.objectives,
        })
        .select('id')
        .single();
      if (!lrow) continue;
      const vocabRows = lesson.vocab.map(([term, meaning]) => ({
        lesson_id: lrow.id,
        term,
        meaning,
      }));
      await supabase.from('vocab').insert(vocabRows);
      await supabase
        .from('lesson_media')
        .insert({ lesson_id: lrow.id, kind: 'image', path: 'sample/placeholder.jpg' });
    }
  }
  await supabase.from('fun_facts').insert([
    { title: 'Tonal language', body_md: 'Yorùbá uses three tones.' },
    { title: 'People', body_md: 'Over 40 million speakers.' },
  ]);
}

run();
