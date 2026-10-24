import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  HelpCircle,
  Target,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ArcGauge } from '@/components/ArcGauge';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { calculateReadiness } from '@/lib/readiness';
import { az900Topics } from '@/data/az900Outline';
import {
  calculateStreak,
  calculateStudyTime,
  calculateTopicMastery,
  evaluateStudyPlan,
  DEFAULT_PLAN_ITEMS,
  getLocalStudySessions,
  subscribeToStudyUpdates,
  TOPIC_MASTERY_RULE_TEXT,
} from '@/lib/studyAnalytics';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const DEFAULT_DOMAINS = [
  { id: 1, domain_id: 1, name: 'Cloud Concepts', weight: '25-30%', code: 'CC' },
  { id: 2, domain_id: 2, name: 'Azure Architecture & Services', weight: '35-40%', code: 'AAS' },
  { id: 3, domain_id: 3, name: 'Azure Management & Governance', weight: '30-35%', code: 'AMG' },
];

function DomainProgress({ id, name, weight, readiness, mastered, total, topicsList = [], onPractice }) {
  const [expanded, setExpanded] = useState(false);

  const cleanName =
    id === 1
      ? 'Cloud Concepts'
      : id === 2
        ? 'Azure Architecture & Services'
        : id === 3
          ? 'Azure Management & Governance'
          : name.replace(/^Describe\s+/i, '');

  const displayReadiness = readiness !== null && readiness !== undefined ? `${readiness}%` : '-';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#DDE3E8] bg-white p-4 dark:border-[#242424] dark:bg-[#121212] transition-all">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold leading-snug text-[#101213] dark:text-[#F8FAFC]">
            {cleanName}
          </p>
          <p className="mt-0.5 text-xs text-[#5B666E] dark:text-slate-400">Exam weight {weight}</p>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-[#007BA7] shrink-0">{displayReadiness}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[#DDE3E8] dark:bg-[#242424]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#FF007F] to-[#D6006B] transition-all duration-500"
          style={{ width: readiness !== null ? `${readiness}%` : '0%' }}
        />
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 font-semibold text-[#007BA7] hover:underline"
        >
          <span>{mastered} of {total} core topics mastered</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {onPractice && (
          <button
            type="button"
            onClick={() => onPractice(id)}
            className="rounded-lg bg-[#007BA7]/10 hover:bg-[#007BA7] hover:text-white px-2.5 py-1 text-[11px] font-bold text-[#007BA7] transition-all"
          >
            Practice
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-2 space-y-2 rounded-xl border border-[#DDE3E8] bg-[#EEF3F6] p-3 text-xs dark:border-[#242424] dark:bg-[#181818] animate-fade-up">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5B666E] dark:text-slate-400">
              Core Topics ({topicsList.length})
            </p>
            <span className="text-[10px] text-slate-500 italic">5+ Qs, 80%+ acc</span>
          </div>
          <div className="space-y-1.5">
            {topicsList.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-white p-2 text-xs border border-[#DDE3E8] dark:bg-[#121212] dark:border-[#202020]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                      t.isMastered
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#DDE3E8] text-[#5B666E] dark:bg-[#242424] dark:text-slate-400'
                    }`}
                  >
                    {t.isMastered ? '✓' : ' '}
                  </span>
                  <span className="font-semibold text-[#101213] dark:text-[#F8FAFC]">
                    {t.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {t.answeredCount ? `${t.answeredCount} answered (${t.accuracy}%)` : `${t.questionCount || 0} Qs`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 animate-pulse">
      <div className="mb-8">
        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-[#181818]" />
        <div className="mt-3 h-8 w-64 rounded-lg bg-slate-200 dark:bg-[#181818]" />
        <div className="mt-2 h-4 w-96 rounded bg-slate-200 dark:bg-[#181818]" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="bento-card md:col-span-2 h-80 border border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212]" />
        <div className="bento-card h-80 border border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212]" />
        <div className="bento-card md:col-span-2 h-64 border border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212]" />
        <div className="bento-card h-64 border border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212]" />
        <div className="bento-card md:col-span-3 h-48 border border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212]" />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { user, profile } = useAuth();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [domains, setDomains] = useState(DEFAULT_DOMAINS);
  const [studySessions, setStudySessions] = useState([]);
  const [studyPlanItems, setStudyPlanItems] = useState(DEFAULT_PLAN_ITEMS);
  const [showMasteryTooltip, setShowMasteryTooltip] = useState(false);

  const fetchDashboardData = async () => {
    try {
      if (!isSupabaseConfigured() || !user?.id) {
        const localAttempts = JSON.parse(localStorage.getItem('africloud_prep_attempts') || '[]');
        const localCards = JSON.parse(localStorage.getItem('africloud_prep_flashcards') || '[]');
        const localSessions = getLocalStudySessions();
        const localPlan = JSON.parse(localStorage.getItem('africloud_prep_study_plan') || 'null');

        setAttempts(localAttempts);
        setFlashcards(localCards);
        setStudySessions(localSessions);
        setDomains(DEFAULT_DOMAINS);

        const basePlan = localPlan?.days?.[0]?.tasks || DEFAULT_PLAN_ITEMS;
        setStudyPlanItems(evaluateStudyPlan(basePlan, { attempts: localAttempts, flashcards: localCards, studySessions: localSessions }));
        setLoading(false);
        return;
      }

      // Fetch live Supabase data
      const [attemptsRes, domainsRes, flashcardsRes, planRes] = await Promise.all([
        supabase.from('attempts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('domains').select('*').order('id'),
        supabase.from('flashcards').select('*').eq('user_id', user.id),
        supabase.from('study_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ]);

      const freshAttempts = attemptsRes.data || [];
      const freshFlashcards = flashcardsRes.data || [];
      const freshDomains = domainsRes.data && domainsRes.data.length > 0 ? domainsRes.data : DEFAULT_DOMAINS;

      // Extract sessions from planRes or fallback to local
      const remoteSessions = planRes.data?.warnings || [];
      const localSessions = getLocalStudySessions();
      const mergedSessions = remoteSessions.length > 0 ? remoteSessions : localSessions;

      setAttempts(freshAttempts);
      setDomains(freshDomains);
      setFlashcards(freshFlashcards);
      setStudySessions(mergedSessions);

      const basePlan = planRes.data?.days?.[0]?.tasks || DEFAULT_PLAN_ITEMS;
      setStudyPlanItems(evaluateStudyPlan(basePlan, { attempts: freshAttempts, flashcards: freshFlashcards, studySessions: mergedSessions }));
    } catch (err) {
      console.warn('Dashboard data refresh notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const unsubscribe = subscribeToStudyUpdates(() => {
      fetchDashboardData();
    });
    return () => unsubscribe();
  }, [user?.id]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // 1. Readiness status & checklist
  const readiness = calculateReadiness(attempts, domains);
  const readinessScore = readiness.total_answered >= 30 ? readiness.overall_accuracy : null;

  const domainEntries = Object.values(readiness.domain_readiness || {});
  let weakestDomainName = 'Governance';
  let weakestDomainAccuracy = null;
  domainEntries.forEach((d) => {
    if (d.accuracy !== null && d.accuracy !== undefined) {
      if (weakestDomainAccuracy === null || d.accuracy < weakestDomainAccuracy) {
        weakestDomainAccuracy = d.accuracy;
        weakestDomainName = d.name.replace('Describe ', '').replace('Azure ', '');
        if (weakestDomainName.includes('Management')) weakestDomainName = 'Governance';
      }
    }
  });
  const weakestDomainPassed = weakestDomainAccuracy !== null && weakestDomainAccuracy >= 70;
  const weakestDomainDisplay = weakestDomainAccuracy !== null ? `${weakestDomainAccuracy}% / 70%` : '- / 70%';

  // 2. Real Topic Mastery (Rule: >= 5 answered with >= 80% accuracy)
  const topicMastery = calculateTopicMastery(attempts, az900Topics);

  // 3. Domain progress mapping with real windowed percentages & '-' on empty
  const domainProgressList = domains.map((d) => {
    const domainId = d.id || d.domain_id;
    const domainAttempts = attempts.filter((a) => a.domain_id === domainId);
    const domainTopics = az900Topics.filter((t) => t.domain_id === domainId);
    const domainTopicMastery = calculateTopicMastery(domainAttempts, domainTopics);

    // Domain percentage: correct / answered from same window, '-' if 0 answers
    const domainWindowAttempts = attempts.slice(0, 50).filter((a) => a.domain_id === domainId);
    const count = domainWindowAttempts.length;
    const correct = domainWindowAttempts.filter((a) => a.is_correct).length;
    const calculatedPct = count > 0 ? Math.round((correct / count) * 100) : null;

    return {
      id: domainId,
      name: d.name,
      weight: d.weight,
      readiness: calculatedPct,
      mastered: domainTopicMastery.masteredCount,
      total: domainTopicMastery.totalCount,
      topicsList: domainTopicMastery.topicsWithStatus,
    };
  });

  // 4. Real Streak calculation
  const allActions = [
    ...attempts,
    ...flashcards,
    ...studySessions,
  ];
  const streakDays = calculateStreak(allActions);

  // 5. Real Study Time calculation
  const studyTimeData = calculateStudyTime(studySessions);
  const hoursThisWeek = studyTimeData.thisWeekDisplay;
  const weeklyChartData = studyTimeData.chartData;

  const nextAction = (() => {
    if (attempts.length === 0) {
      return {
        title: 'Start Diagnostic Quiz',
        minutes: 10,
        domain: 'AZ-900 Benchmark',
        route: 'quiz',
      };
    }
    const lowest = [...domainProgressList].sort((a, b) => (a.readiness || 0) - (b.readiness || 0))[0];
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
      title: `Reinforce ${lowest?.name || 'Fundamentals'}`,
      minutes: 15,
      domain: lowest?.name || 'Azure Architecture',
      route: 'quiz',
    };
  })();

  const toggleTask = async (id) => {
    const updated = studyPlanItems.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setStudyPlanItems(updated);

    if (user?.id && isSupabaseConfigured()) {
      try {
        await supabase.from('study_plans').upsert({
          user_id: user.id,
          exam_date: profile?.exam_date || new Date().toISOString().split('T')[0],
          days: [{ tasks: updated }],
        });
      } catch (err) {
        console.warn('Could not persist study plan update:', err);
      }
    } else {
      localStorage.setItem('africloud_prep_study_plan', JSON.stringify({ days: [{ tasks: updated }] }));
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <span className="eyebrow">Readiness Tracker</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#101213] dark:text-[#F8FAFC] sm:text-4xl">
          Your AZ-900 readiness
        </h1>
        <p className="mt-2 max-w-lg text-[#5B666E] dark:text-slate-400">
          Updated after every quiz and review session. Aim for 80%+ before you book the exam.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main gauge card - span 2 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card bento-card-cerulean md:col-span-2 flex flex-col transition-all"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Overall readiness</p>
              <h2 className="mt-1 text-xl font-bold text-[#101213] dark:text-[#F8FAFC]">
                {readiness.is_exam_ready
                  ? 'Exam Ready! You are set to pass'
                  : readiness.gap_message || "Keep going - you're close"}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#007BA7]/40 bg-[#007BA7]/10 px-3 py-1 text-xs font-semibold text-[#007BA7]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {readiness.is_exam_ready ? 'Exam Ready' : (readiness.total_answered >= 30 ? 'In Progress' : 'Unranked')}
            </span>
          </div>

          <div className="mt-4 flex flex-1 flex-col items-center justify-center py-4">
            <ArcGauge
              value={readinessScore}
              label="Readiness"
              sublabel={readiness.total_answered >= 30 ? 'Target: 80% over last 50' : 'Min. 30 questions required'}
            />

            {/* 3-Line Readiness Checklist */}
            <div className="mt-4 w-full max-w-md space-y-2 rounded-xl border border-[#DDE3E8] bg-[#F6F8FA] dark:border-[#242424] dark:bg-[#141414] p-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-[#DDE3E8] dark:border-[#202020] pb-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Readiness Rule Checklist
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  3 requirements
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#101213] dark:text-slate-300">
                  {readiness.total_answered >= 30 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 dark:border-slate-600 text-[10px] text-slate-500 shrink-0">1</span>
                  )}
                  Questions answered (min. 30)
                </span>
                <span className={`font-mono font-bold ${readiness.total_answered >= 30 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {readiness.total_answered} / 30
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#101213] dark:text-slate-300">
                  {readiness.total_answered >= 30 && readiness.overall_accuracy >= 80 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 dark:border-slate-600 text-[10px] text-slate-500 shrink-0">2</span>
                  )}
                  Overall accuracy (last 50, min. 80%)
                </span>
                <span className={`font-mono font-bold ${readiness.total_answered >= 30 && readiness.overall_accuracy >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {readiness.total_answered > 0 ? `${readiness.overall_accuracy}%` : '-'} / 80%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#101213] dark:text-slate-300">
                  {weakestDomainPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 dark:border-slate-600 text-[10px] text-slate-500 shrink-0">3</span>
                  )}
                  Weakest domain ({weakestDomainName}, min. 70%)
                </span>
                <span className={`font-mono font-bold ${weakestDomainPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {weakestDomainDisplay}
                </span>
              </div>
            </div>

            {/* Dynamic Gap Line */}
            <div className="mt-3 flex w-full max-w-md items-center gap-2 rounded-xl border border-[#007BA7]/30 bg-[#007BA7]/10 px-3.5 py-2.5 text-xs font-semibold text-[#007BA7]">
              <Target className="h-4 w-4 shrink-0 text-[#007BA7]" />
              <span>{readiness.gap_message}</span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-3 border-t border-[#DDE3E8] dark:border-[#242424] pt-5">
            <div>
              <p className="text-xs text-[#5B666E] dark:text-slate-400">Streak</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-[#101213] dark:text-[#F8FAFC]">
                <Flame className="h-4 w-4 text-orange-500" /> {streakDays} {streakDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5B666E] dark:text-slate-400">This week</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-[#101213] dark:text-[#F8FAFC]">
                <Clock className="h-4 w-4 text-[#007BA7]" /> {hoursThisWeek}
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center gap-1">
                <p className="text-xs text-[#5B666E] dark:text-slate-400">Topics</p>
                <button
                  type="button"
                  onClick={() => setShowMasteryTooltip((prev) => !prev)}
                  title="Topic mastery criteria"
                  aria-label="Topic mastery criteria"
                  className="text-slate-400 hover:text-[#007BA7]"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-[#101213] dark:text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#007BA7]" /> {topicMastery.masteredCount}/
                {topicMastery.totalCount}
              </p>
              {showMasteryTooltip && (
                <div className="absolute bottom-full mb-2 left-0 w-52 rounded-xl border border-[#DDE3E8] bg-white p-2.5 text-[11px] shadow-lg dark:border-[#242424] dark:bg-[#181818] text-[#101213] dark:text-slate-300 z-30">
                  <p className="font-bold text-[#007BA7] mb-1">Topic Mastery Rule</p>
                  <p>{TOPIC_MASTERY_RULE_TEXT}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Next best action card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card bento-card-rose flex flex-col justify-between border-2 border-[#FF007F] shadow-sm transition-all"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF007F]">
              Next best action
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#101213] dark:text-[#F8FAFC]">
              {nextAction.title}
            </h3>
            <div className="mt-3 flex items-center gap-2 text-sm text-[#5B666E] dark:text-slate-300">
              <Clock className="h-4 w-4 text-[#FF007F]" /> {nextAction.minutes} min •{' '}
              {nextAction.domain}
            </div>
          </div>
          <button
            onClick={() => navigate(nextAction.route)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF007F] to-[#D6006B] hover:from-[#D6006B] hover:to-[#B30059] px-5 py-3 text-sm font-bold text-[#FAF8F3] shadow-sm transition-all hover:scale-[1.02] active:scale-95"
          >
            Start now <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        {/* Domain progress - span 2 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card md:col-span-2 flex flex-col gap-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-[#007BA7]" />
              <h2 className="text-lg font-bold text-[#101213] dark:text-[#F8FAFC]">Per-domain progress</h2>
            </div>
            <span className="text-[11px] font-semibold text-[#5B666E] dark:text-slate-400 rounded-full border border-[#DDE3E8] bg-[#EEF3F6] px-2.5 py-0.5 dark:border-[#242424] dark:bg-[#181818]">
              90 practice questions across 11 core topics
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {domainProgressList.map((d) => (
              <DomainProgress key={d.id} {...d} onPractice={(domainId) => navigate(`quiz?domain=${domainId}`)} />
            ))}
          </div>
        </motion.div>

        {/* Weekly activity chart */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card flex flex-col"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4.5 w-4.5 text-[#007BA7]" />
            <h2 className="text-lg font-bold text-[#101213] dark:text-[#F8FAFC]">Study minutes</h2>
          </div>
          <p className="mt-1 text-xs text-[#5B666E] dark:text-slate-400">Last 7 days</p>
          <div className="mt-3 h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: resolvedTheme === 'dark' ? '#94a3b8' : '#5B666E' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 123, 167, 0.12)' }}
                  formatter={(val) => [`${val} mins`, 'Study Time']}
                  contentStyle={{
                    backgroundColor: resolvedTheme === 'dark' ? '#121212' : '#ffffff',
                    borderRadius: 12,
                    border: resolvedTheme === 'dark' ? '1px solid #242424' : '1px solid #DDE3E8',
                    fontSize: 12,
                    fontWeight: 600,
                    color: resolvedTheme === 'dark' ? '#F8FAFC' : '#101213',
                  }}
                />
                <Bar dataKey="minutes" radius={[6, 6, 0, 0]} fill="#007BA7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Study plan card - span 3 */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bento-card md:col-span-3"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-[#007BA7]" />
              <h2 className="text-lg font-bold text-[#101213] dark:text-[#F8FAFC]">Personal study plan</h2>
            </div>
            <span className="text-xs font-semibold text-[#FF007F]">
              {studyPlanItems.filter((s) => s.done).length} of {studyPlanItems.length} completed
            </span>
          </div>
          <ul className="divide-y divide-[#DDE3E8] dark:divide-[#242424]">
            {studyPlanItems.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(s.id)}
                    aria-label={s.done ? `Mark '${s.title}' incomplete` : `Mark '${s.title}' complete`}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007BA7] rounded-full"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                        s.done
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 hover:border-[#007BA7] dark:border-slate-600'
                      }`}
                    >
                      {s.done && <CheckCircle2 className="h-4 w-4" />}
                    </span>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          s.done
                            ? 'text-slate-400 line-through'
                            : 'text-[#101213] dark:text-[#F8FAFC]'
                        }`}
                      >
                        {s.title}
                      </p>
                      <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                        s.type === 'auto'
                          ? 'bg-[#007BA7]/10 text-[#007BA7]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {s.type === 'auto' ? 'Auto' : 'Manual'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5B666E] dark:text-slate-400">
                      {s.domain} • {s.minutes} mins
                    </p>
                  </div>
                </div>
                {s.done && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Done
                  </span>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
