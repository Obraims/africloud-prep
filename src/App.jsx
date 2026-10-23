import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from '@/context/ThemeContext';
import { RouterProvider } from '@/context/RouterContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PwaProvider } from '@/context/PwaContext';
import { TopNav } from '@/components/TopNav';
import { MobileTabBar } from '@/components/MobileTabBar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AuthPage } from '@/pages/AuthPage';
import { QuizPage } from '@/pages/QuizPage';
import { FlashcardsPage } from '@/pages/FlashcardsPage';
import { BuddyPage } from '@/pages/BuddyPage';
import { APP_NAME } from '@/config/brand';

function PageLoader() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-[#007BA7] border-t-transparent" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Loading {APP_NAME}...
        </span>
      </div>
    </div>
  );
}

// Strict Route Guard: If authenticated, redirect to /dashboard
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Strict Route Guard: If unauthenticated, redirect to /auth
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div
      className={`relative flex min-h-screen flex-col overflow-x-hidden bg-[#050505] text-[#FAF8F3] ${
        user ? 'pb-[calc(4rem_+_env(safe-area-inset-bottom))] md:pb-0' : ''
      }`}
    >
      <div className="bg-ambient-glow" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Routes location={location}>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth"
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz"
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/flashcards"
                  element={
                    <ProtectedRoute>
                      <FlashcardsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buddy"
                  element={
                    <ProtectedRoute>
                      <BuddyPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
      <MobileTabBar />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PwaProvider>
          <BrowserRouter>
            <RouterProvider>
              <AnimatedRoutes />
            </RouterProvider>
          </BrowserRouter>
        </PwaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
