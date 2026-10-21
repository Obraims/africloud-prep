import React, { useState } from 'react';
import { X, User, CheckCircle2, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const { profile, updateProfile, loginWithDemo } = useAuth();
  const [name, setName] = useState(profile?.display_name || 'Amina Kimani');
  const [email, setEmail] = useState(profile?.email || 'amina@example.com');
  const [examDate, setExamDate] = useState(profile?.exam_date || '2026-11-02');
  const [dailyHours, setDailyHours] = useState(profile?.daily_hours || 1.5);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      display_name: name,
      email,
      exam_date: examDate,
      daily_hours: Number(dailyHours),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-700 text-white dark:bg-indigo-600">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Learner Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">AZ-900 Study Settings</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Amina's Demo Profile</p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300">12 days to exam • Pre-seeded practice</p>
            </div>
            <button
              type="button"
              onClick={() => {
                loginWithDemo();
                onClose();
              }}
              className="rounded-lg bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-800 dark:bg-indigo-600"
            >
              Reset Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Daily Hours
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white"
              >
                <option value="0.5">30 mins</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-700 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95 dark:bg-indigo-600 flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
