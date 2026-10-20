-- =====================================================================
-- AfriCloud Prep Full Database Schema & Row Level Security Policies
-- Microsoft Azure Fundamentals (AZ-900) Study Platform
-- =====================================================================

create extension if not exists "pgcrypto";

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  exam_date date,
  target_score int default 80,
  daily_hours numeric default 1.5,
  language text default 'English',
  streak_days int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. DOMAINS
create table if not exists public.domains (
  id int primary key,
  name text not null,
  weight text not null,
  code text not null,
  created_at timestamptz default now()
);

-- 3. TOPICS
create table if not exists public.topics (
  id text primary key,
  domain_id int not null references public.domains(id) on delete cascade,
  name text not null,
  objectives jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 4. QUESTIONS (90 Seed Questions, reviewed=false)
create table if not exists public.questions (
  id text primary key,
  domain_id int not null references public.domains(id) on delete cascade,
  topic_id text not null references public.topics(id) on delete cascade,
  objective text,
  question text not null,
  options jsonb not null,
  correct_index int not null,
  explanation text not null,
  wrong_explanations jsonb not null,
  learn_url text,
  difficulty int default 1,
  reviewed bool default false,
  source text default 'bank',
  created_at timestamptz default now()
);

-- 5. ATTEMPTS
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  domain_id int not null references public.domains(id) on delete cascade,
  topic_id text,
  selected_index int not null,
  is_correct bool not null,
  mode text default 'practice',
  created_at timestamptz default now()
);

-- 6. FLASHCARDS (Leitner 5-Box Spaced Repetition)
create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text references public.questions(id) on delete set null,
  front text not null,
  back text not null,
  domain text,
  box int not null default 1 check (box between 1 and 5),
  next_review timestamptz not null default now(),
  source text default 'missed_quiz',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. STUDY PLANS
create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_date date not null,
  hours_per_day numeric default 1.5,
  summary text,
  days jsonb not null,
  warnings jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 8. CHAT THREADS
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'Study Session',
  language text default 'English',
  created_at timestamptz default now()
);

-- 9. CHAT MESSAGES
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.chat_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'ai', 'assistant')),
  text text not null,
  lang text default 'English',
  created_at timestamptz default now()
);

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================
create index if not exists idx_profiles_user on public.profiles(id);
create index if not exists idx_topics_domain on public.topics(domain_id);
create index if not exists idx_questions_domain on public.questions(domain_id);
create index if not exists idx_questions_topic on public.questions(topic_id);
create index if not exists idx_questions_reviewed on public.questions(reviewed);

create index if not exists idx_attempts_user on public.attempts(user_id);
create index if not exists idx_attempts_created on public.attempts(created_at desc);
create index if not exists idx_attempts_user_created on public.attempts(user_id, created_at desc);

create index if not exists idx_flashcards_user on public.flashcards(user_id);
create index if not exists idx_flashcards_next_review on public.flashcards(next_review);
create index if not exists idx_flashcards_user_box on public.flashcards(user_id, box);

create index if not exists idx_study_plans_user on public.study_plans(user_id);
create index if not exists idx_chat_threads_user on public.chat_threads(user_id);
create index if not exists idx_chat_messages_thread on public.chat_messages(thread_id);
create index if not exists idx_chat_messages_user on public.chat_messages(user_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.domains enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.flashcards enable row level security;
alter table public.study_plans enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- Domains, Topics, Questions: Read-only for authenticated & anon
create policy "Domains readable by all" on public.domains for select to authenticated, anon using (true);
create policy "Topics readable by all" on public.topics for select to authenticated, anon using (true);
create policy "Questions readable by all" on public.questions for select to authenticated, anon using (true);

-- Profiles: Own profile only
create policy "Users can view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- Attempts: Own attempts only
create policy "Users can view own attempts" on public.attempts for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own attempts" on public.attempts for insert to authenticated with check (auth.uid() = user_id);

-- Flashcards: Full access to own cards
create policy "Users can view own flashcards" on public.flashcards for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own flashcards" on public.flashcards for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own flashcards" on public.flashcards for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own flashcards" on public.flashcards for delete to authenticated using (auth.uid() = user_id);

-- Study Plans: Full access to own plans
create policy "Users can view own study plans" on public.study_plans for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own study plans" on public.study_plans for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own study plans" on public.study_plans for update to authenticated using (auth.uid() = user_id);
create policy "Users can delete own study plans" on public.study_plans for delete to authenticated using (auth.uid() = user_id);

-- Chat Threads & Messages: Own threads only
create policy "Users can view own threads" on public.chat_threads for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own threads" on public.chat_threads for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can delete own threads" on public.chat_threads for delete to authenticated using (auth.uid() = user_id);

create policy "Users can view own messages" on public.chat_messages for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert to authenticated with check (auth.uid() = user_id);
