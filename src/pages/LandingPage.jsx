import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Bot, BrainCircuit, CheckCircle2, Sparkles, Timer } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const officialDomains = [
  { id: 1, name: 'Cloud Concepts', weight: '25-30%', readiness: 85 },
  { id: 2, name: 'Azure Architecture & Services', weight: '35-40%', readiness: 72 },
  { id: 3, name: 'Azure Management & Governance', weight: '30-35%', readiness: 68 },
];

function MiniGauge({ value }) {
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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{value}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Readiness</span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { navigate } = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-20">
      {/* Hero */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-3xl text-center">
        <motion.div variants={fadeUp} className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" /> Unofficial AZ-900 prep for African learners
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
          Study smart. <br />
          <span className="text-indigo-700 dark:text-indigo-400">Know when you're ready.</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
          Stop guessing your exam readiness. CloudMwalimu connects smart diagnostic quizzes, spaced-repetition flashcards, and an AI study buddy speaking English, Kiswahili, and Sheng into one continuous learning loop.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3.5 text-sm font-bold text-white shadow-lifted transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
          >
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('auth')}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create Free Account
          </button>
        </motion.div>
      </motion.div>

      {/* Bento Grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Card 1: Live Readiness */}
        <motion.div variants={fadeUp} className="bento-card flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow">Real-time signal</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <BarChart3 className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Exam Readiness Gauge</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Deterministic readiness algorithm based on the official Microsoft Learn skills weights.
            </p>
          </div>
          <div className="my-6 flex justify-center">
            <MiniGauge value={74} />
          </div>
          <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-800 dark:bg-slate-850 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">Next best action:</span> Raise Governance by 9% to unlock exam-ready.
          </div>
        </motion.div>

        {/* Card 2: AI Study Buddy */}
        <motion.div variants={fadeUp} className="bento-card flex flex-col justify-between sm:col-span-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow">Local analogies</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <Bot className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">AI Study Buddy (Mwalimu)</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Cloud concepts explained with Kenyan real-life examples — M-Pesa agents, matatus, SACCO keys, and county by-laws.
            </p>
          </div>

          {/* Card 2: AI Study Buddy */}
          <div className="my-4 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-start gap-2.5">
              <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                SW
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-200">
                "Availability Zone ni kama maduka tofauti ya wakala wa M-Pesa mtaani: moja likikosa stima, lingine mtaa wa pili linaendelea kuhudumia."
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                SH
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-200">
                "Azure Policy ni kama by-laws za county — lazima kila gari ipitie inspection ndio ishikwe na kanjo."
              </p>
            </div>
          </div>

          <button onClick={() => navigate('buddy')} className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
            Chat with Mwalimu <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>

        {/* Card 3: Domain Breakdown */}
        <motion.div variants={fadeUp} className="bento-card flex flex-col justify-between sm:col-span-2">
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow">Skills measured</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <BrainCircuit className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Three Official Domains</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              90 reviewed practice questions strictly aligned to the official Microsoft Learn outline.
            </p>
          </div>

          <div className="my-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {officialDomains.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{d.weight}</span>
                  <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400">{d.readiness}%</span>
                </div>
                <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{d.name}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-indigo-700 dark:bg-indigo-500" style={{ width: `${d.readiness}%` }} />
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('quiz')} className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
            Practice questions <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>

        {/* Card 4: Leitner Spaced Repetition */}
        <motion.div variants={fadeUp} className="bento-card flex flex-col justify-between sm:col-span-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow">Spaced repetition</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <Timer className="h-4 w-4" />
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Leitner Flashcard Coach</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              5-box spaced repetition. Any missed quiz question automatically turns into a review card.
            </p>
          </div>

          <div className="my-4 flex items-center justify-between rounded-xl bg-slate-100 p-3 text-xs dark:bg-slate-850">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Due today:</span>
            <span className="rounded-md bg-indigo-700 px-2 py-0.5 font-bold text-white dark:bg-indigo-600">Review Queue</span>
          </div>

          <button onClick={() => navigate('flashcards')} className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline">
            Review cards <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
