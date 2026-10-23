import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://ukngplhebmofppnxitbq.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbmdwbGhlYm1vZnBwbnhpdGJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTM5OTUsImV4cCI6MjA5ODU2OTk5NX0.R8QH904b9vZamUjfyvpx0DJWXreT_6w27f0sb4ZGX7s';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL).trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY).trim();

const supabaseUrl = rawUrl || FALLBACK_URL;
const supabaseAnonKey = rawKey || FALLBACK_KEY;

export const isSupabaseConfigured = () => {
  const url = (import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL).trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY).trim();
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
