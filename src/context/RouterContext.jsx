import React, { createContext, useContext, useMemo, useState } from 'react';

const RouterContext = createContext(undefined);

export function RouterProvider({ children }) {
  const [route, setRoute] = useState('landing');

  const value = useMemo(
    () => ({
      route,
      navigate: (next) => {
        setRoute(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }),
    [route]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
