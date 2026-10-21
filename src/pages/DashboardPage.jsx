import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ArcGauge } from '@/components/ArcGauge';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { calculateReadiness } from '@/lib/readiness';
import { domains as initialDomains, weeklyActivity as initialWeekly, studyPlan as initialPlan } from '@/data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function DomainProgress({ name, weight, readiness, mastered, total }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Exam weight {weight}</p>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{readiness}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-700 dark:bg-indigo-500 transition-all duration-500"
          style={{ width: `${readiness}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {mastered} of {total} core topics mastered
      </p>
    </div>
  );
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { profile } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [plan, setPlan] = useState(initialPlan);

  useEffect(() => {
    // Load attempts from local storage or profile
    const storedAttempts = localStorage.getItem('cm_attempts');
    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts));
    } else {
      // Default pre-seeded demo state (Amina: Storage & Governance weak, Cloud Concepts strong)
      const demoAttempts = [
        ...Array(15).fill(0).map((_, i) => ({ id: `att-1-${i}`, domain_id: 1, domain: 'Cloud Concepts', is_correct: true })),
        ...Array(15).fill(0).map((_, i) => ({ id: `att-2-${i}`, domain_id: 2, domain: 'Azure Architecture & Services', is_correct: i < 11 })),
        ...Array(18).fill(0).map((_, i) => ({ id: `att-3-${i}`, domain_id: 3, domain: 'Azure Management & Governance', is_correct: i < 11 })),
      ];
      setAttempts(demoAttempts);
      localStorage.setItem('cm_attempts', JSON.stringify(demoAttempts));
    }

    const storedPlan = localStorage.getItem('cm_study_plan');
    if (storedPlan) {
      setPlan(JSON.parse(storedPlan));
    }
  }, []);

  const readiness = calculateReadiness(attempts, initialDomains);

  const toggleTask = (id) => {
    const updated = plan.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setPlan(updated);
    localStorage.setItem('cm_study_plan', JSON.stringify(updated));
  };

  const domainScores = initialDomains.map((d) => {
    const r = readiness.domain_readiness[d.domain_id || d.id];
    return {
      ...d,
      readiness: r?.accuracy !== null && r?.accuracy !== undefined ? r.accuracy : d.readiness,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      {/* Welcome Bar */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Personalized for AZ-900</span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Welcome back, {profile?.display_name ? profile.display_name.split(' ')[0] : 'Amina'}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Target exam date: {profile?.exam_date || 'Nov 2, 2026'} • 12 days remaining
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{profile?.streak_days || 5} days streak</span>
          </div>
          <button
            onClick={() => navigate('quiz')}
            className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2 text-sm font-bold text-white shadow-lifted transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
          >
            Start Quiz <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Readiness Gauge Bento Card */}
        <motion.div variants={fadeUp} className="bento-card md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow">Readiness</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Exam Readiness</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Strict 80% threshold across domains
            </p>
          </div>

          <div className="my-4">
            <ArcGauge value={readiness.overall_accuracy} label={readiness.is_exam_ready ? 'Exam Ready' : 'In Progress'} sublabel="Overall score" />
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-3 text-xs dark:border-indigo-900/60 dark:bg-indigo-950/40">
            <span className="font-bold text-indigo-950 dark:text-indigo-200">Next best action: </span>
            <span className="text-indigo-800 dark:text-indigo-300">{readiness.gap_message}</span>
          </div>
        </motion.div>

        {/* Domain Progress Cards */}
        <motion.div variants={fadeUp} className="bento-card md:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="eyebrow">Domain Breakdown</span>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Official AZ-900 Skills Progress</h2>
            </div>
            <span className="text-xs text-slate-400">Pass mark ≥ 70%</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {domainScores.map((d) => (
              <DomainProgress key={d.id} {...d} />
            ))}
          </div>
        </motion.div>

        {/* Study Plan Card */}
        <motion.div variants={fadeUp} className="bento-card md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <CalendarDays className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's Study Plan</h2>
            </div>
            <span className="text-xs text-slate-400">Target: 47 mins</span>
          </div>

          <div className="space-y-2 mt-4">
            {plan.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                  item.done
                    ? 'border-slate-200/60 bg-slate-50/60 text-slate-400 line-through dark:border-slate-800/60 dark:bg-slate-900/40'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-5 w-5 ${item.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{item.minutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div variants={fadeUp} className="bento-card md:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow">Activity</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
              <BarChart3 className="h-4 w-4" />
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Study Minutes</h2>

          <div className="h-40 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialWeekly}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                  contentStyle={{
                    backgroundColor: '#1e1b4b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="minutes" fill="#4338ca" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
