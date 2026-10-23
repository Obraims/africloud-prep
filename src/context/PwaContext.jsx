import { createContext, useContext, useState, useEffect } from 'react';

const PwaContext = createContext({
  isInstallable: false,
  isInstalled: false,
  installApp: async () => {},
});

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for browsers without prompt API (e.g. Safari, iOS)
      alert(
        'To install AfriCloud Prep as an App:\n\n' +
          '• On Chrome/Edge: Click the install icon (⤓) in your address bar or browser menu.\n' +
          '• On iPhone/iPad (Safari): Tap the Share button (⎋) and select "Add to Home Screen".\n' +
          '• On Android: Tap the menu (⋮) and select "Install app" or "Add to Home Screen".'
      );
    }
  };

  return (
    <PwaContext.Provider
      value={{
        isInstallable: !!deferredPrompt || !isInstalled,
        isInstalled,
        installApp,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  return useContext(PwaContext);
}
