import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { loginWithFirebaseGoogle } from '@/lib/firebaseClient';

const AuthContext = createContext(null);

const DEMO_USER_KEY = 'africloud_prep_demo_user';
const DEMO_PROFILE_KEY = 'africloud_prep_demo_profile';

const DEFAULT_GUEST_PROFILE = {
  id: 'guest-amina-kimani',
  email: 'amina.kimani@africloud.dev',
  display_name: 'Amina Kimani',
  exam_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  daily_hours: 1.5,
  target_score: 80,
  streak_days: 3,
};

export function AuthProvider({ children }) {
  // Synchronous initial restore from localStorage so there is ZERO spinner on page refresh
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState(() => {
    try {
      const savedUser = localStorage.getItem(DEMO_USER_KEY);
      return savedUser ? { user: JSON.parse(savedUser), access_token: 'local-token' } : null;
    } catch {
      return null;
    }
  });

  // If local user is already restored, loading starts at false!
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem(DEMO_USER_KEY);
    } catch {
      return false;
    }
  });

  const isConfigured = isSupabaseConfigured();

  const fetchProfile = async (userId, userEmail, userMeta) => {
    try {
      // 2-second timeout guard on profile fetch so it NEVER hangs
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (data) {
        setProfile(data);
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(data));
      } else {
        const defaultProfile = {
          id: userId,
          email: userEmail,
          display_name: userMeta?.display_name || userEmail?.split('@')[0] || 'Learner',
          exam_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daily_hours: 1.5,
          target_score: 80,
          streak_days: 1,
        };
        setProfile(defaultProfile);
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(defaultProfile));
        supabase.from('profiles').upsert(defaultProfile).catch(() => {});
      }
    } catch (err) {
      console.warn('Profile fetch handled gracefully:', err);
      // Fallback to local profile or default
      if (!profile) {
        const fallback = {
          id: userId,
          email: userEmail,
          display_name: userMeta?.display_name || userEmail?.split('@')[0] || 'Learner',
          exam_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          daily_hours: 1.5,
          target_score: 80,
          streak_days: 1,
        };
        setProfile(fallback);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    // Hard safety timeout: loader MUST dismiss within 600ms no matter what
    const safetyTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 600);

    if (!isConfigured) {
      setLoading(false);
      clearTimeout(safetyTimer);
      return;
    }

    // Check remote Supabase session
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (!mounted) return;
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          localStorage.setItem(DEMO_USER_KEY, JSON.stringify(currentSession.user));
          fetchProfile(
            currentSession.user.id,
            currentSession.user.email,
            currentSession.user.user_metadata
          );
        } else {
          // If no remote session, check if we have a valid guest session in localStorage
          try {
            const saved = localStorage.getItem(DEMO_USER_KEY);
            if (saved) {
              const u = JSON.parse(saved);
              setUser(u);
              setSession({ user: u, access_token: 'demo-token' });
            }
          } catch (e) {
            console.warn('Local check notice:', e);
          }
        }
      })
      .catch((err) => {
        console.warn('Supabase getSession notice:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      if (newSession?.user) {
        setSession(newSession);
        setUser(newSession.user);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newSession.user));
        fetchProfile(
          newSession.user.id,
          newSession.user.email,
          newSession.user.user_metadata
        );
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, [isConfigured]);

  const signInWithGoogle = async () => {
    try {
      const googleUser = await loginWithFirebaseGoogle();
      if (!googleUser) return null;

      const appUser = {
        id: googleUser.uid,
        email: googleUser.email,
        user_metadata: {
          display_name: googleUser.displayName || googleUser.email?.split('@')[0] || 'Learner',
          avatar_url: googleUser.photoURL || null,
        },
      };

      const appSession = {
        user: appUser,
        access_token: await googleUser.getIdToken().catch(() => 'google-token'),
      };

      let userProfile = {
        id: appUser.id,
        email: appUser.email,
        display_name: appUser.user_metadata.display_name,
        exam_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daily_hours: 1.5,
        target_score: 80,
        streak_days: 1,
      };

      try {
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(appUser));
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(userProfile));
      } catch (e) {
        console.warn('Storage save notice:', e);
      }

      setUser(appUser);
      setSession(appSession);
      setProfile(userProfile);
      setLoading(false);

      if (isConfigured) {
        supabase.from('profiles').upsert(userProfile).catch(() => {});
      }

      return { user: appUser, session: appSession };
    } catch (err) {
      console.error('Google sign-in notice:', err);
      throw err;
    }
  };

  const signInAsGuest = async (emailOverride, nameOverride) => {
    const guestEmail = emailOverride || 'amina.kimani@africloud.dev';
    const guestName = nameOverride || (emailOverride ? emailOverride.split('@')[0] : 'Amina Kimani');
    const guestUser = {
      id: 'guest-' + (guestEmail.split('@')[0] || 'amina'),
      email: guestEmail,
      user_metadata: { display_name: guestName },
    };
    const guestSession = { user: guestUser, access_token: 'demo-guest-token' };

    let guestProfile = {
      id: guestUser.id,
      email: guestEmail,
      display_name: guestName,
      exam_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daily_hours: 1.5,
      target_score: 80,
      streak_days: 3,
    };

    try {
      const stored = localStorage.getItem(DEMO_PROFILE_KEY);
      if (stored) {
        guestProfile = { ...guestProfile, ...JSON.parse(stored), email: guestEmail, display_name: guestName };
      }
    } catch (e) {
      console.warn('Guest profile notice:', e);
    }

    try {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(guestUser));
      localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(guestProfile));
    } catch (e) {
      console.warn('Storage save notice:', e);
    }

    setUser(guestUser);
    setSession(guestSession);
    setProfile(guestProfile);
    setLoading(false);
    return { user: guestUser, session: guestSession };
  };

  const resetPassword = async (email) => {
    if (!isConfigured) {
      return { message: 'Demo mode: Password reset email simulated.' };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    if (error) throw error;
    return data;
  };

  const resendConfirmation = async (email) => {
    if (!isConfigured) {
      return { message: 'Demo mode: Confirmation email simulated.' };
    }
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) {
        if (res.error.message?.toLowerCase().includes('email not confirmed')) {
          const err = new Error('Email not confirmed. You can enter the Demo Dashboard directly or resend confirmation.');
          err.code = 'email_not_confirmed';
          throw err;
        }
        throw res.error;
      }
      if (res.data?.user) {
        setUser(res.data.user);
        setSession(res.data.session);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(res.data.user));
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      if (err.message?.toLowerCase().includes('email not confirmed')) {
        err.code = 'email_not_confirmed';
        throw err;
      }
      if (
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('Failed to fetch')
      ) {
        throw new Error(
          'Unable to reach Supabase database. Please check your internet connection.'
        );
      }
      throw err;
    }
  };

  const signUp = async (email, password, { displayName, examDate, dailyHours } = {}) => {
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
          console.warn('Profile creation notice:', e);
        }
        setProfile(newProfile);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(res.data.user));
        localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(newProfile));
      }

      setLoading(false);
      return res.data;
    } catch (err) {
      if (
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('Failed to fetch')
      ) {
        throw new Error(
          'Unable to reach Supabase database. Please check your internet connection.'
        );
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      localStorage.removeItem(DEMO_PROFILE_KEY);
      if (isConfigured) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch (e) {
      console.warn('Signout notice:', e);
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
    localStorage.setItem(DEMO_PROFILE_KEY, JSON.stringify(merged));

    if (isConfigured) {
      supabase.from('profiles').update(updates).eq('id', user.id).catch(() => {});
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
        signInWithGoogle,
        signInAsGuest,
        resetPassword,
        resendConfirmation,
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
