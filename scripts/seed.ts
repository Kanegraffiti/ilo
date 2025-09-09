import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const client = createClient(url, key);

async function run() {
  const { data: module } = await client
    .from('modules')
    .insert({ title: 'Module 1: Greetings' })
    .select()
    .single();
  const { data: lessons } = await client
    .from('lessons')
    .insert([
      {
        module_id: module.id,
        title: 'Lesson 1',
        objectives: ['Say hello'],
        notes_md: '# Hello',
      },
      {
        module_id: module.id,
        title: 'Lesson 2',
        objectives: ['Say thanks'],
        notes_md: '# Thanks',
      },
    ])
    .select();
  await client.from('vocab').insert([
    { lesson_id: lessons[0].id, term: 'Báwo', meaning: 'Hello' },
    { lesson_id: lessons[0].id, term: 'Ẹ kú àárọ̀', meaning: 'Good morning' },
    { lesson_id: lessons[0].id, term: 'Ẹ káàbọ̀', meaning: 'Welcome' },
    { lesson_id: lessons[1].id, term: 'Ẹ ṣé', meaning: 'Thank you' },
    { lesson_id: lessons[1].id, term: 'Ọ pẹ́ ẹ', meaning: 'You are correct' },
    { lesson_id: lessons[1].id, term: 'Má bínú', meaning: 'Sorry' },
  ]);
  await client.from('fun_facts').insert([
    { title: 'Yoruba Fact 1', body_md: 'The Yoruba language has three tones.' },
    { title: 'Yoruba Fact 2', body_md: 'Greetings are very important in Yoruba culture.' },
  ]);
  console.log('Seed complete');
}

run();
