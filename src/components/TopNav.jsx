import { useState } from 'react';
import { User, LogOut, ArrowRight, Download } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { usePwa } from '@/context/PwaContext';
import { AuthModal } from './AuthModal';
import { APP_NAME } from '@/config/brand';

const navItems = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Planner', route: 'planner' },
  { label: 'Quiz', route: 'quiz' },
  { label: 'Flashcards', route: 'flashcards' },
  { label: 'AI Buddy', route: 'buddy' },
];

export function TopNav() {
  const { route, navigate } = useRouter();
  const { user, profile, signOut } = useAuth();
  const { isInstalled, installApp } = usePwa();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('auth');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#242424] bg-[#121212]/90 pt-safe-t backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <button
          onClick={() => navigate(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
        >
          <img
            src="/brand/logo-mark.svg"
            alt={APP_NAME}
            className="h-9 w-9 rounded-xl object-contain shadow-cerulean"
          />
          <span className="text-lg font-extrabold tracking-tight text-[#F8FAFC]">
            AfriCloud <span className="text-[#007BA7]">Prep</span>
          </span>
        </button>

        {user ? (
          <div className="hidden items-center gap-1.5 md:flex">
            {navItems.map((item) => {
              const isActive = route === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'border border-[#007BA7]/60 bg-[#007BA7]/20 text-[#F8FAFC] shadow-sm'
                      : 'text-slate-400 hover:bg-[#181818] hover:text-[#F8FAFC]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="hidden items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400 md:flex">
            <span>AZ-900 Prep</span>
            <span className="text-slate-600">|</span>
            <span className="text-[#007BA7]">Kenyan Analogies</span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          {/* Download / Install Web App Button */}
          {!isInstalled && (
            <button
              onClick={installApp}
              title="Install AfriCloud Prep as an App"
              aria-label="Install App"
              className="flex items-center gap-1.5 rounded-xl border border-[#007BA7]/40 bg-[#007BA7]/15 px-3 py-2 text-xs font-bold text-[#F8FAFC] transition-all hover:bg-[#007BA7] hover:border-[#007BA7]"
            >
              <Download className="h-3.5 w-3.5 text-[#FF007F]" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {user ? (
            <>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-[#007BA7]/40 bg-[#007BA7]/15 px-3.5 py-2 text-xs font-bold text-[#007BA7] transition-all hover:bg-[#007BA7]/25 hover:border-[#007BA7]"
              >
                <User className="h-3.5 w-3.5" />
                <span>
                  {profile?.display_name ? profile.display_name.split(' ')[0] : 'Learner'}
                </span>
              </button>

              <button
                onClick={handleSignOut}
                title="Sign Out"
                aria-label="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#242424] bg-[#181818] text-slate-400 transition-all hover:border-[#FF007F] hover:bg-[#FF007F]/15 hover:text-[#FF007F]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('auth')}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF007F] hover:from-[#005C8A] hover:to-[#D6006B] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#007BA7]/30 hover:shadow-[#FF007F]/40 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </nav>

      {user && <AuthModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />}
    </header>
  );
}
