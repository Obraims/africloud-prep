import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-anon-key';

export const isSupabaseConfigured = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    !url.includes('your-project-id') &&
    !anonKey.includes('placeholder') &&
    !anonKey.includes('your-supabase-anon-key')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
