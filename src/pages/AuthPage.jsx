import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { APP_NAME } from '@/config/brand';

export function AuthPage() {
  const { signIn, signUp, isConfigured } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [examDate, setExamDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  });
  const [dailyHours, setDailyHours] = useState('1.5');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Strong password rule evaluations
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passedRulesCount = Object.values(passwordRules).filter(Boolean).length;

  const getStrengthMeta = () => {
    if (!password) return { label: 'Empty', color: 'bg-slate-700', width: '0%' };
    if (passedRulesCount <= 2) return { label: 'Weak', color: 'bg-[#FF007F]', width: '25%' };
    if (passedRulesCount === 3) return { label: 'Fair', color: 'bg-amber-500', width: '50%' };
    if (passedRulesCount === 4) return { label: 'Good', color: 'bg-[#007BA7]', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strengthMeta = getStrengthMeta();
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Strong password validations on sign-up
    if (mode === 'signup') {
      if (!passwordRules.length) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
      if (!passwordRules.uppercase) {
        setErrorMsg('Password must include at least one uppercase letter (A-Z).');
        return;
      }
      if (!passwordRules.lowercase) {
        setErrorMsg('Password must include at least one lowercase letter (a-z).');
        return;
      }
      if (!passwordRules.number) {
        setErrorMsg('Password must include at least one number (0-9).');
        return;
      }
      if (!passwordRules.special) {
        setErrorMsg('Password must include at least one special character (e.g. !@#$%^&*).');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your confirm password field.');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('dashboard');
      } else {
        await signUp(email, password, {
          displayName,
          examDate,
          dailyHours: Number(dailyHours),
        });
        setSuccessMsg(
          isConfigured
            ? 'Account created! Entering dashboard...'
            : 'Account ready (Demo Mode)! Entering dashboard...'
        );
        setTimeout(() => {
          navigate('dashboard');
        }, 600);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="mb-3 flex items-center justify-center gap-2.5">
            <img
              src="/brand/logo-mark.svg"
              alt=""
              className="h-10 w-10 rounded-xl object-contain shadow-sm"
            />
            <span className="text-2xl font-extrabold tracking-tight text-[#FAF8F3]">
              {APP_NAME}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#FAF8F3] sm:text-3xl">
            {mode === 'signin' ? `Welcome back to ${APP_NAME}` : 'Create your learner account'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === 'signin'
              ? `Log in to track your AZ-900 readiness with ${APP_NAME}.`
              : 'Sign up to master Azure fundamentals with tailored AI guidance.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bento-card border border-[#242424] bg-[#121212] p-6 shadow-lifted sm:p-8">
          {/* Mode Switcher Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-[#181818] p-1 border border-[#242424]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-[#007BA7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-[#F8FAFC]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-[#007BA7] text-white shadow-sm'
                  : 'text-slate-400 hover:text-[#F8FAFC]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#FF007F] bg-[#FF007F]/15 p-3.5 text-xs font-medium text-[#FF007F]"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-[#FF007F]" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#007BA7] bg-[#007BA7]/15 p-3.5 text-xs font-medium text-[#007BA7]"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#007BA7]" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Alex Kimani"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-[#242424] bg-[#181818] py-2.5 pl-10 pr-3.5 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7] focus:bg-[#202020]"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username email"
                  placeholder="learner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#242424] bg-[#181818] py-2.5 pl-10 pr-3.5 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7] focus:bg-[#202020]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                <span>Password</span>
                {mode === 'signup' && password && (
                  <span
                    className={`text-[10px] font-bold ${
                      passedRulesCount <= 2
                        ? 'text-[#FF007F]'
                        : passedRulesCount === 3
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                    }`}
                  >
                    Strength: {strengthMeta.label}
                  </span>
                )}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#242424] bg-[#181818] py-2.5 pl-10 pr-10 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7] focus:bg-[#202020]"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-[#F8FAFC] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength meter and checklist for Sign Up */}
              {mode === 'signup' && (
                <div className="mt-2.5 space-y-2 rounded-xl border border-[#202020] bg-[#151515] p-3 text-xs">
                  {/* Strength Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#242424]">
                    <div
                      className={`h-full transition-all duration-300 ${strengthMeta.color}`}
                      style={{ width: strengthMeta.width }}
                    />
                  </div>

                  <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#007BA7]" /> Password Requirements:
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] sm:grid-cols-3">
                    <span
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        passwordRules.length ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {passwordRules.length ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 text-center">•</span>
                      )}
                      8+ characters
                    </span>

                    <span
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        passwordRules.uppercase ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {passwordRules.uppercase ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 text-center">•</span>
                      )}
                      1 uppercase (A-Z)
                    </span>

                    <span
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        passwordRules.lowercase ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {passwordRules.lowercase ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 text-center">•</span>
                      )}
                      1 lowercase (a-z)
                    </span>

                    <span
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        passwordRules.number ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {passwordRules.number ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 text-center">•</span>
                      )}
                      1 number (0-9)
                    </span>

                    <span
                      className={`flex items-center gap-1 font-medium transition-colors ${
                        passwordRules.special ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {passwordRules.special ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 text-center">•</span>
                      )}
                      1 symbol (!@#$%)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <label htmlFor="auth-confirm-password">Confirm Password</label>
                  {passwordsMatch && (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                      <Check className="h-3 w-3" /> Passwords match
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[10px] font-bold text-[#FF007F]">
                      Passwords do not match
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    id="auth-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-[#181818] py-2.5 pl-10 pr-10 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:bg-[#202020] ${
                      passwordsMismatch
                        ? 'border-[#FF007F] focus:border-[#FF007F]'
                        : passwordsMatch
                          ? 'border-emerald-500/70 focus:border-emerald-500'
                          : 'border-[#242424] focus:border-[#007BA7]'
                    }`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-[#F8FAFC] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="auth-exam-date"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Exam Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-exam-date"
                      name="examDate"
                      type="date"
                      required
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full rounded-xl border border-[#242424] bg-[#181818] py-2.5 pl-9 pr-2.5 text-xs font-medium text-[#F8FAFC] outline-none focus:border-[#007BA7]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="auth-daily-hours"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                  >
                    Daily Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <select
                      id="auth-daily-hours"
                      name="dailyHours"
                      value={dailyHours}
                      onChange={(e) => setDailyHours(e.target.value)}
                      className="w-full rounded-xl border border-[#242424] bg-[#181818] py-2.5 pl-9 pr-2.5 text-xs font-medium text-[#F8FAFC] outline-none focus:border-[#007BA7]"
                    >
                      <option value="0.5">30 mins</option>
                      <option value="1">1 hour</option>
                      <option value="1.5">1.5 hours</option>
                      <option value="2">2 hours</option>
                      <option value="3">3 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#007BA7] to-[#FF007F] hover:from-[#005C8A] hover:to-[#D6006B] py-3 text-sm font-bold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{mode === 'signin' ? 'Authenticating...' : 'Creating profile...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Setup & Enter'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#242424] pt-4 text-center text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-[#007BA7]" />
            <span>
              {isConfigured
                ? 'Protected by Supabase Auth & Row Level Security'
                : 'Local Demo Mode Active (Add credentials to .env for cloud sync)'}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('landing')}
            className="text-xs font-semibold text-slate-400 hover:text-[#007BA7]"
          >
            ← Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
