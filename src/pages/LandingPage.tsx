import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, BrainCircuit, CheckCircle2, Cloud, Sparkles, Timer } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { readinessScore, domains } from '@/data/mockData';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function MiniGauge({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-800" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-indigo-700 dark:stroke-indigo-500"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-2xl font-extrabold text-slate-900 dark:text-white">{value}%</span>
    </div>
  );
}

function FeatureBento() {
  const { navigate } = useRouter();

  const steps = [
    {
      icon: BrainCircuit,
      title: 'Diagnostic Quiz',
      desc: 'A 12-question check that maps your knowledge across all 3 AZ-900 domains in under 5 minutes.',
      action: 'Take the quiz',
      route: 'quiz' as const,
      span: 'md:col-span-2',
    },
    {
      icon: Bot,
      title: 'AI Study Buddy',
      desc: 'Chat that explains cloud concepts using local Kenyan analogies — M-Pesa shops, matatus, SACCOs.',
      action: 'Chat now',
      route: 'buddy' as const,
      span: 'md:col-span-1',
    },
    {
      icon: BarChart3,
      title: 'Readiness Tracker',
      desc: 'A live readiness score tells you exactly when you are ready to pass.',
      action: 'View dashboard',
      route: 'dashboard' as const,
      span: 'md:col-span-1',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {steps.map((s) => (
        <motion.button
          key={s.title}
          variants={fadeUp}
          onClick={() => navigate(s.route)}
          className={`bento-card group flex flex-col items-start text-left transition-all hover:shadow-lifted ${s.span}`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400">
            <s.icon className="h-5.5 w-5.5" strokeWidth={2.2} />
          </span>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            {s.action}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function SampleDashboardBento() {
  return (
    <motion.div
      variants={fadeUp}
      className="bento-card grid grid-cols-1 gap-4 p-0 overflow-hidden md:grid-cols-3"
    >
      <div className="flex flex-col items-center justify-center gap-3 border-b border-slate-200 p-6 md:border-b-0 md:border-r dark:border-slate-800">
        <MiniGauge value={readinessScore} />
        <span className="eyebrow">Your readiness</span>
      </div>
      <div className="col-span-2 flex flex-col justify-center gap-4 p-6">
        {domains.map((d) => (
          <div key={d.id}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">{d.name}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{d.readiness}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-700 dark:bg-indigo-500"
                style={{ width: `${d.readiness}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const { navigate } = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      {/* Hero */}
      <motion.section
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center pt-16 pb-12 text-center sm:pt-24"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-700 dark:text-indigo-400" />
          Built for African developers
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl md:text-7xl dark:text-white"
        >
          Study smart.
          <br />
          <span className="text-indigo-700 dark:text-indigo-400">Know when you're ready.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400"
        >
          CloudMwalimu guides you through the Microsoft Azure Fundamentals (AZ-900) exam with a diagnostic quiz, an AI
          study buddy that speaks your language, and a readiness score that tells you exactly when to book the test.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate('quiz')}
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3.5 text-base font-semibold text-white shadow-lifted transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
          >
            Start your diagnostic
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            See the dashboard
          </button>
        </motion.div>
      </motion.section>

      {/* Sample dashboard bento preview */}
      <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} className="pb-4">
        <SampleDashboardBento />
      </motion.section>

      {/* Feature bento */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="py-12"
      >
        <motion.div variants={fadeUp} className="mb-6 text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            One loop. From "not sure" to "ready".
          </h2>
        </motion.div>
        <FeatureBento />
      </motion.section>

      {/* Value props strip */}
      <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Timer, title: '5-min diagnostic', desc: 'Know your baseline across all 3 domains instantly.' },
            { icon: Cloud, title: 'Local-first analogies', desc: 'Availability zones explained with M-Pesa shops.' },
            { icon: CheckCircle2, title: 'Know when you are ready', desc: 'A single readiness score, not a vague guess.' },
          ].map((v) => (
            <motion.div key={v.title} variants={fadeUp} className="bento-card flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400">
                <v.icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
