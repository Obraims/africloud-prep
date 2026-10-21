import React, { useState } from 'react';
import { Cloud, Moon, Sun, User, LogOut, ArrowRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';

const navItems = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Quiz', route: 'quiz' },
  { label: 'Flashcards', route: 'flashcards' },
  { label: 'AI Buddy', route: 'buddy' },
];

export function TopNav() {
  const { theme, toggle } = useTheme();
  const { route, navigate } = useRouter();
  const { user, profile, signOut } = useAuth();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('auth');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 glass dark:border-slate-800/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <button
          onClick={() => navigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-lifted dark:bg-indigo-600">
            <Cloud className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cloud<span className="text-indigo-700 dark:text-indigo-400">Mwalimu</span>
          </span>
        </button>

        {user ? (
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  route === item.route
                    ? 'font-bold text-slate-900 dark:text-white bg-slate-100/80 dark:bg-slate-800/80'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
            <span>AZ-900 Certification Coach</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Kenyan Analogies</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {user ? (
            <>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                <User className="h-3.5 w-3.5" />
                <span>{profile?.display_name ? profile.display_name.split(' ')[0] : 'Learner'}</span>
              </button>

              <button
                onClick={handleSignOut}
                title="Sign Out"
                aria-label="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('auth')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-soft transition-transform hover:scale-[1.02] active:scale-95 dark:bg-indigo-600"
            >
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </nav>

      {user && (
        <AuthModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      )}
    </header>
  );
}
