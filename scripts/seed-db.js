import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Skipping remote DB seed: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY not provided.');
  console.log('The application will use the local embedded seed data in src/data/seedData.js.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const seedDir = path.join(process.cwd(), 'supabase', 'seed');
  const outline = JSON.parse(fs.readFileSync(path.join(seedDir, 'outline.json'), 'utf-8'));
  const questions = JSON.parse(fs.readFileSync(path.join(seedDir, 'questions.json'), 'utf-8'));

  console.log('1. Seeding domains...');
  const { error: dErr } = await supabase
    .from('domains')
    .upsert(outline.domains, { onConflict: 'id' });
  if (dErr) console.warn('Domains seed warning:', dErr.message);

  console.log('2. Seeding topics...');
  const { error: tErr } = await supabase
    .from('topics')
    .upsert(outline.topics, { onConflict: 'id' });
  if (tErr) console.warn('Topics seed warning:', tErr.message);

  console.log(`3. Seeding ${questions.length} questions (reviewed = false)...`);
  const formattedQuestions = questions.map((q) => ({
    ...q,
    reviewed: false,
    source: 'bank',
  }));
  const { error: qErr } = await supabase
    .from('questions')
    .upsert(formattedQuestions, { onConflict: 'id' });
  if (qErr) {
    console.error('Questions seed error:', qErr);
    process.exit(1);
  }

  console.log('✓ Successfully seeded database with domains, topics, and 90 questions.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
