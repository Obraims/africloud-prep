import { useState, useEffect } from 'react';
import { X, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AuthModal({ isOpen, onClose }) {
  const { profile, updateProfile, user } = useAuth();
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState('1.5');
  const [targetScore, setTargetScore] = useState('80');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || user?.user_metadata?.display_name || '');
      setExamDate(profile.exam_date || '2026-11-15');
      setDailyHours(String(profile.daily_hours || 1.5));
      setTargetScore(String(profile.target_score || 80));
    }
  }, [profile, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      await updateProfile({
        display_name: name,
        exam_date: examDate,
        daily_hours: Number(dailyHours),
        target_score: Number(targetScore),
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-[#242424] bg-[#121212] p-6 shadow-lifted">
        <div className="flex items-center justify-between border-b border-[#242424] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007BA7] text-white">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Learner Profile</h3>
              <p className="text-xs text-slate-400">AZ-900 Study Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#181818] hover:text-[#F8FAFC]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#FF007F] bg-[#FF007F]/15 p-3 text-xs font-semibold text-[#FF007F]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#242424] bg-[#181818] px-3.5 py-2.5 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7] focus:bg-[#202020]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Email (read only)
            </label>
            <input
              type="email"
              value={user?.email || profile?.email || ''}
              disabled
              className="w-full rounded-xl border border-[#242424] bg-[#0A0A0A] px-3.5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl border border-[#242424] bg-[#181818] px-3 py-2 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7]"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Hours
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full rounded-xl border border-[#242424] bg-[#181818] px-3 py-2 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7]"
              >
                <option value="0.5">30 mins</option>
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Target Pass Score (%)
            </label>
            <input
              type="number"
              min={70}
              max={100}
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full rounded-xl border border-[#242424] bg-[#181818] px-3.5 py-2.5 text-sm font-medium text-[#F8FAFC] outline-none transition-colors focus:border-[#007BA7]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#007BA7] hover:bg-[#005C8A] py-3 text-sm font-bold text-white shadow-cerulean transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Saved successfully!</span>
              </>
            ) : saving ? (
              <span>Saving...</span>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
