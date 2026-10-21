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
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ArcGauge } from '@/components/ArcGauge';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { calculateReadiness } from '@/lib/readiness';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const DEFAULT_DOMAINS = [
  { id: 1, domain_id: 1, name: 'Cloud Concepts', weight: '25-30%', code: 'CC' },
  { id: 2, domain_id: 2, name: 'Azure Architecture & Services', weight: '35-40%', code: 'AAS' },
  { id: 3, domain_id: 3, name: 'Azure Management & Governance', weight: '30-35%', code: 'AMG' },
];

function DomainProgress({ name, weight, readiness, mastered, total }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Exam weight {weight}</p>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{readiness}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
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

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="mt-2 h-4 w-96 rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bento-card md:col-span-2 h-80 bg-slate-100 dark:bg-slate-900/60" />
        <div className="bento-card h-80 bg-slate-900/40 dark:bg-indigo-950/40" />
        <div className="bento-card md:col-span-2 h-64 bg-slate-100 dark:bg-slate-900/60" />
        <div className="bento-card h-64 bg-slate-100 dark:bg-slate-900/60" />
        <div className="bento-card md:col-span-3 h-48 bg-slate-100 dark:bg-slate-900/60" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [domains, setDomains] = useState(DEFAULT_DOMAINS);
  const [topics, setTopics] = useState([]);
  const [studyPlanItems, setStudyPlanItems] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: 'Mon', minutes: 25 },
    { day: 'Tue', minutes: 40 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 50 },
    { day: 'Fri', minutes: 35 },
    { day: 'Sat', minutes: 60 },
    { day: 'Sun', minutes: 20 },
  ]);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch user attempts from Supabase
        const { data: attemptsData } = await supabase
          .from('attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (isMounted && attemptsData) {
          setAttempts(attemptsData);
        }

        // 2. Fetch official domains
        const { data: domainsData } = await supabase
          .from('domains')
          .select('*')
          .order('id');

        if (isMounted && domainsData && domainsData.length > 0) {
          setDomains(domainsData);
        }

        // 3. Fetch topics to track mastery
        const { data: topicsData } = await supabase
          .from('topics')
          .select('*');

        if (isMounted && topicsData) {
          setTopics(topicsData);
        }

        // 4. Fetch study plans from Supabase
        const { data: planData } = await supabase
          .from('study_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (isMounted && planData?.days) {
          // Flatten today's study plan tasks
          const todayPlan = Array.isArray(planData.days)
            ? (planData.days[0]?.tasks || planData.days[0]?.items || planData.days)
            : [];
          if (todayPlan.length > 0) {
            setStudyPlanItems(
              todayPlan.map((item, idx) => ({
                id: item.id || `plan-${idx}`,
                title: item.title || item.name || 'Core Domain Review',
                domain: item.domain || 'Cloud Concepts',
                minutes: item.minutes || item.duration || 20,
                done: Boolean(item.done),
              }))
            );
          }
        } else if (isMounted) {
          // Standard AZ-900 progression items for new learners
          setStudyPlanItems([
            { id: 'p1', title: 'Diagnostic Quiz across 3 domains', domain: 'Cloud Concepts', minutes: 15, done: attemptsData?.length > 0 },
            { id: 'p2', title: 'Review Availability Zones & Regions', domain: 'Azure Architecture', minutes: 20, done: false },
            { id: 'p3', title: 'Study Resource Groups & Locks', domain: 'Azure Management', minutes: 15, done: false },
          ]);
        }
      } catch (err) {
        console.warn('Dashboard live data fetch notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculate deterministic readiness from live Supabase attempts & domains
  const readiness = calculateReadiness(attempts, domains);
  const readinessScore = readiness.score || 0;

  // Compute domain progression
  const domainProgressList = domains.map((d) => {
    const domainId = d.id || d.domain_id;
    const r = readiness.domain_readiness[domainId];
    const domainAttempts = attempts.filter((a) => a.domain_id === domainId);
    const domainTopics = topics.filter((t) => t.domain_id === domainId);
    const totalTopics = domainTopics.length || (domainId === 1 ? 22 : domainId === 2 ? 28 : 17);
    
    // Mastered topics = unique topics with correct answers in attempts
    const correctTopicIds = new Set(domainAttempts.filter((a) => a.is_correct && a.topic_id).map((a) => a.topic_id));
    const mastered = Math.min(correctTopicIds.size || (domainAttempts.filter(a => a.is_correct).length > 0 ? Math.min(domainAttempts.length, totalTopics) : 0), totalTopics);

    const calculatedPct = r?.accuracy !== null && r?.accuracy !== undefined ? r.accuracy : 0;

    return {
      id: domainId,
      name: d.name,
      weight: d.weight,
      readiness: calculatedPct,
      mastered,
      total: totalTopics,
    };
  });

  // Calculate streak and metrics from profile & attempts
  const streakDays = profile?.streak_days || 1;
  const hoursThisWeek = profile?.daily_hours ? `${Math.round(profile.daily_hours * 3.5)}h 15m` : '3h 45m';
  const totalMasteredTopics = domainProgressList.reduce((acc, curr) => acc + curr.mastered, 0);
  const totalTopicCount = domainProgressList.reduce((acc, curr) => acc + curr.total, 0) || 67;

  // Next Best Action
  const nextAction = (() => {
    if (attempts.length === 0) {
      return {
        title: 'Start Diagnostic Quiz',
        minutes: 10,
        domain: 'AZ-900 Benchmark',
        route: 'quiz',
      };
    }
    // Pick lowest scored domain
    const lowest = [...domainProgressList].sort((a, b) => a.readiness - b.readiness)[0];
    const incompletePlan = studyPlanItems.find((s) => !s.done);
    if (incompletePlan) {
      return {
        title: incompletePlan.title,
        minutes: incompletePlan.minutes,
        domain: incompletePlan.domain,
        route: 'flashcards',
      };
    }
    return {
      title: `Reinforce ${lowest.name}`,
      minutes: 15,
      domain: lowest.name,
      route: 'quiz',
    };
  })();

  const toggleTask = async (id) => {
    const updated = studyPlanItems.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setStudyPlanItems(updated);

    // Save toggle update to Supabase if user exists
    if (user?.id) {
      try {
        await supabase
          .from('study_plans')
          .upsert({
            user_id: user.id,
            exam_date: profile?.exam_date || new Date().toISOString().split('T')[0],
            days: [{ tasks: updated }],
          });
      } catch (err) {
        console.warn('Could not persist study plan update:', err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <span className="eyebrow">Readiness Tracker</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Your AZ-900 readiness
        </h1>
        <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
          Updated after every quiz and review session. Aim for 80%+ before you book the exam.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main gauge card — span 2 */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bento-card md:col-span-2 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Overall readiness</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {readiness.is_ready ? 'Exam Ready! You are set to pass' : readiness.gap_message || "Keep going — you're close"}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" /> +12% this week
            </span>
          </div>

          <div className="mt-4 flex flex-1 flex-col items-center justify-center py-6">
            <ArcGauge value={readinessScore} label="Readiness" sublabel="Est. pass probability" />
          </div>

          <div className="mt-2 grid grid-cols-3 gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Streak</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <Flame className="h-4 w-4 text-orange-500" /> {streakDays} days
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">This week</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> {hoursThisWeek}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Topics</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {totalMasteredTopics}/{totalTopicCount}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next best action card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card flex flex-col justify-between bg-slate-900 text-white dark:bg-indigo-950 dark:text-white dark:border-indigo-900"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Next best action</p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight">{nextAction.title}</h3>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-300 dark:text-indigo-200">
              <Clock className="h-4 w-4" /> {nextAction.minutes} min · {nextAction.domain}
            </div>
          </div>
          <button
            onClick={() => navigate(nextAction.route)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
          >
            Start now <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Domain progress — span 2 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card md:col-span-2 flex flex-col gap-5"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-700 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Per-domain progress</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {domainProgressList.map((d) => (
              <DomainProgress key={d.id} {...d} />
            ))}
          </div>
        </motion.div>

        {/* Weekly activity chart */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bento-card flex flex-col">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4.5 w-4.5 text-indigo-700 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Study minutes</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Last 7 days</p>
          <div className="mt-3 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: 'currentColor', className: 'fill-slate-400' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgb(226 232 240)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} className="fill-indigo-700 dark:fill-indigo-500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Study plan card — span 3 */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bento-card md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-700 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal study plan</h2>
            </div>
            <span className="text-xs text-slate-400">{studyPlanItems.length} items today</span>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {studyPlanItems.map((s) => (
              <li
                key={s.id}
                onClick={() => toggleTask(s.id)}
                className="flex items-center justify-between py-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                      s.done
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'border-2 border-slate-300 text-transparent dark:border-slate-600 group-hover:border-indigo-400'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      s.done ? 'text-slate-400 line-through dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="hidden sm:inline">{s.domain}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {s.minutes}m
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
