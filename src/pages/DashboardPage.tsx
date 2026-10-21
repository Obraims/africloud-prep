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
import { domains, readinessScore, studyPlan, weeklyActivity } from '@/data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

function DomainProgress({ name, weight, readiness, mastered, total }: typeof domains[number]) {
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
          className="h-full rounded-full bg-indigo-700 dark:bg-indigo-500"
          style={{ width: `${readiness}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500">
        {mastered} of {total} topics mastered
      </p>
    </div>
  );
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const nextAction = studyPlan.find((s) => !s.done) ?? studyPlan[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
        <span className="eyebrow">Readiness Tracker</span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Your AZ-900 readiness
        </h1>
        <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
          Updated after every quiz and review session. Aim for 80%+ before you book the exam.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main gauge card — span 2 */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="bento-card md:col-span-2 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Overall readiness</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Keep going — you're close</h2>
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
                <Flame className="h-4 w-4 text-orange-500" /> 6 days
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">This week</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> 4h 20m
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Topics</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 44/67
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
            onClick={() => navigate('flashcards')}
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
            {domains.map((d) => (
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
            <span className="text-xs text-slate-400">3 items today</span>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {studyPlan.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      s.done
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'border-2 border-slate-300 text-transparent dark:border-slate-600'
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
