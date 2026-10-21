import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'amina-demo-account',
  email: 'amina@example.com',
  display_name: 'Amina Kimani',
  exam_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  daily_hours: 1.5,
  streak_days: 5,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage demo or supabase session
    const stored = localStorage.getItem('cm_user_profile');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setProfile(parsed);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      // Default to Amina demo account
      setUser(DEMO_USER);
      setProfile(DEMO_USER);
      localStorage.setItem('cm_user_profile', JSON.stringify(DEMO_USER));
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(DEMO_USER);
        setProfile(DEMO_USER);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(DEMO_USER);
        setProfile(DEMO_USER);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data);
    } catch (e) {
      console.warn('Profile fetch error:', e);
    }
  };

  const loginWithDemo = () => {
    setUser(DEMO_USER);
    setProfile(DEMO_USER);
    localStorage.setItem('cm_user_profile', JSON.stringify(DEMO_USER));
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) {
      loginWithDemo();
      return { data: { user: DEMO_USER } };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password, displayName) => {
    if (!isSupabaseConfigured()) {
      const newUser = { ...DEMO_USER, email, display_name: displayName };
      setUser(newUser);
      setProfile(newUser);
      localStorage.setItem('cm_user_profile', JSON.stringify(newUser));
      return { data: { user: newUser } };
    }
    const res = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    return res;
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    loginWithDemo();
  };

  const updateProfile = async (updates) => {
    const updated = { ...(profile || user), ...updates };
    setProfile(updated);
    setUser(updated);
    localStorage.setItem('cm_user_profile', JSON.stringify(updated));

    if (isSupabaseConfigured() && user?.id && user.id !== DEMO_USER.id) {
      await supabase.from('profiles').upsert({ id: user.id, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: profile || user || DEMO_USER,
        loading,
        signIn,
        signUp,
        signOut,
        loginWithDemo,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
