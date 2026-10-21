import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Route = 'landing' | 'dashboard' | 'quiz' | 'flashcards' | 'buddy';

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('landing');

  const value = useMemo(
    () => ({
      route,
      navigate: (next: Route) => {
        setRoute(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }),
    [route]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
