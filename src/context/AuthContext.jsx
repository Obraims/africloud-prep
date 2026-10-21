import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'africloud_prep_demo_user';
const DEMO_PROFILE_KEY = 'africloud_prep_demo_profile';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  const fetchProfile = async (userId, userEmail, userMeta) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile:', error.message);
      }

      if (data) {
        setProfile(data);
      } else {
        // Create initial profile if missing
        const defaultProfile = {
          id: userId,
          email: userEmail,
          display_name: userMeta?.display_name || userEmail?.split('@')[0] || 'Learner',
          exam_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daily_hours: 1.5,
          target_score: 80,
          streak_days: 1,
        };
        const { data: created } = await supabase
          .from('profiles')
          .upsert(defaultProfile)
          .select()
          .maybeSingle();
        setProfile(created || defaultProfile);
      }
    } catch (err) {
      console.warn('Profile fetch exception:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // If Supabase is not configured with live credentials, use local storage session
    if (!isConfigured) {
      try {
        const savedUserStr = localStorage.getItem(DEMO_USER_KEY);
        const savedProfileStr = localStorage.getItem(DEMO_PROFILE_KEY);
        if (savedUserStr) {
          const parsedUser = JSON.parse(savedUserStr);
          setUser(parsedUser);
          setSession({ user: parsedUser, access_token: 'demo-access-token' });
          if (savedProfileStr) {
            setProfile(JSON.parse(savedProfileStr));
          }
        }
      } catch (err) {
        console.warn('Local session restore warning:', err);
      } finally {
        if (mounted) setLoading(false);
      }
      return;
    }

    // Live Supabase authentication
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          fetchProfile(
            currentSession.user.id,
            currentSession.user.email,
            currentSession.user.user_metadata
          ).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Session fetch notice:', err);
        if (mounted) setLoading(false);
      });

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await fetchProfile(
          newSession.user.id,
          newSession.user.email,
          newSession.user.user_metadata
        );
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email, password) => {
    if (!isConfigured) {
      const displayName = email.split('@')[0];
      const demoUser = {
        id: 'demo-learner-user',
        email,
        user_metadata: { display_name: displayName },
      };
      const demoSession = { user: demoUser, access_token: 'demo-token' };

      let demoProfile = {
        id: demoUser.id,
        email,
        display_name: displayName,
        exam_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_hours: 1.5,
        target_score: 80,
        streak_days: 1,
      };

      try {
        const storedProfile = localStorage.getItem(DEMO_PROFILE_KEY);
        if (storedProfile) {
          demoProfile = { ...demoProfile, ...JSON.parse(storedProfile), email };
        }
      } catch (e) {
        console.warn('Profile read warning:', e);
      }

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));

      setUser(demoUser);
      setSession(demoSession);
      setProfile(demoProfile);
      return { user: demoUser, session: demoSession };
    }

    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) throw res.error;
      return res.data;
    } catch (err) {
      if (
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('Failed to fetch')
      ) {
        throw new Error(
          'Unable to reach Supabase database. Please check your internet connection or verify VITE_SUPABASE_URL in your .env file.'
        );
      }
      throw err;
    }
  };

  const signUp = async (email, password, { displayName, examDate, dailyHours } = {}) => {
    if (!isConfigured) {
      const name = displayName || email.split('@')[0];
      const demoUser = {
        id: `learner-${Date.now()}`,
        email,
        user_metadata: { display_name: name },
      };
      const demoSession = { user: demoUser, access_token: 'demo-token' };

      const demoProfile = {
        id: demoUser.id,
        email,
        display_name: name,
        exam_date:
          examDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_hours: dailyHours ? Number(dailyHours) : 1.5,
        target_score: 80,
        streak_days: 1,
      };

      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(demoProfile));

      setUser(demoUser);
      setSession(demoSession);
      setProfile(demoProfile);
      return { user: demoUser, session: demoSession };
    }

    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (res.error) throw res.error;

      if (res.data?.user) {
        const newProfile = {
          id: res.data.user.id,
          email,
          display_name: displayName || email.split('@')[0],
          exam_date:
            examDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daily_hours: dailyHours ? Number(dailyHours) : 1.5,
          target_score: 80,
          streak_days: 1,
        };

        try {
          await supabase.from('profiles').upsert(newProfile);
        } catch (e) {
          console.warn('Profile creation warning:', e);
        }
        setProfile(newProfile);
      }

      return res.data;
    } catch (err) {
      if (
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('Failed to fetch')
      ) {
        throw new Error(
          'Unable to reach Supabase database. Please check your internet connection or verify VITE_SUPABASE_URL in your .env file.'
        );
      }
      throw err;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (!isConfigured) {
        localStorage.removeItem(DEMO_USER_KEY);
        localStorage.removeItem(DEMO_PROFILE_KEY);
      } else {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Signout warning:', e);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user?.id) return;
    const merged = { ...profile, ...updates };
    setProfile(merged);

    if (!isConfigured) {
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(merged));
      return;
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

    if (error) {
      console.warn('Error updating profile in Supabase:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
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
