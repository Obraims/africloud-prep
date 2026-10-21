import { Cloud, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useRouter, type Route } from '@/context/RouterContext';

const navItems: { label: string; route: Route }[] = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Quiz', route: 'quiz' },
  { label: 'Flashcards', route: 'flashcards' },
  { label: 'AI Buddy', route: 'buddy' },
];

export function TopNav() {
  const { theme, toggle } = useTheme();
  const { route, navigate } = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 glass dark:border-slate-800/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <button onClick={() => navigate('landing')} className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-lifted dark:bg-indigo-500">
            <Cloud className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Cloud<span className="text-indigo-700 dark:text-indigo-400">Mwalimu</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                route === item.route
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
          <button
            onClick={() => navigate('dashboard')}
            className="hidden rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 sm:block dark:bg-indigo-600"
          >
            Get started
          </button>
        </div>
      </nav>
    </header>
  );
}
