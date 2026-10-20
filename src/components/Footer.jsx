import { useRouter } from '@/context/RouterContext';
import { APP_NAME, APP_TAGLINE, APP_DISCLAIMER } from '@/config/brand';

const footerLinks = [
  { label: 'Dashboard', route: 'dashboard' },
  { label: 'Quiz', route: 'quiz' },
  { label: 'Flashcards', route: 'flashcards' },
  { label: 'AI Study Buddy', route: 'buddy' },
];

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-[#242424] bg-[#050505]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand/logo-full.svg"
                alt={APP_NAME}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {APP_TAGLINE} An AI-guided path to the Microsoft Azure Fundamentals (AZ-900) exam with
              authentic Kenyan analogies.
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
                      className="text-sm font-medium text-slate-400 transition-colors hover:text-[#007BA7]"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-[#242424] pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {APP_DISCLAIMER}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. For learning purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
