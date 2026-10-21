import { Cloud } from 'lucide-react';
import { useRouter, type Route } from '@/context/RouterContext';

const footerLinks: { label: string; route: Route }[] = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Quiz', route: 'quiz' },
  { label: 'Flashcards', route: 'flashcards' },
  { label: 'AI Study Buddy', route: 'buddy' },
];

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white dark:bg-indigo-500">
                <Cloud className="h-4.5 w-4.5" strokeWidth={2.4} />
              </span>
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">
                Cloud<span className="text-indigo-700 dark:text-indigo-400">Mwalimu</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Study smart. Know when you're ready. An AI-guided path to the Microsoft Azure Fundamentals (AZ-900) exam.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="eyebrow mb-3">Navigate</p>
              <ul className="space-y-2">
                {footerLinks.map((l) => (
                  <li key={l.route}>
                    <button
                      onClick={() => navigate(l.route)}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-slate-200 pt-5 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Unofficial study tool — not affiliated with or endorsed by Microsoft.
          </p>
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} CloudMwalimu. For learning purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
