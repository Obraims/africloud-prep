import { BookOpen, Brain, Calendar, LayoutDashboard, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';

const tabs = [
  { label: 'Home', route: 'dashboard', Icon: LayoutDashboard },
  { label: 'Quiz', route: 'quiz', Icon: Brain },
  { label: 'Cards', route: 'flashcards', Icon: BookOpen },
  { label: 'Buddy', route: 'buddy', Icon: MessageCircle },
];

export function MobileTabBar() {
  const { user } = useAuth();
  const { route, navigate } = useRouter();

  if (!user) return null;

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#242424] bg-[#121212]/95 pb-safe-b backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5">
        {tabs.map(({ label, route: tabRoute, Icon }) => {
          const isActive = route === tabRoute;

          return (
            <button
              key={tabRoute}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigate(tabRoute)}
              className={`flex min-h-tap flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#4CC3EC]' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
