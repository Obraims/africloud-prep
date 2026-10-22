import { createContext, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RouterContext = createContext(undefined);

export function RouterProvider({ children }) {
  const location = useLocation();
  const navigateHook = useNavigate();

  const route = useMemo(() => {
    const p = location.pathname.replace(/^\//, '');
    return p === '' ? 'landing' : p;
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      route,
      navigate: (dest) => {
        const target = dest.startsWith('/') ? dest : dest === 'landing' ? '/' : `/${dest}`;
        navigateHook(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }),
    [route, navigateHook]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
