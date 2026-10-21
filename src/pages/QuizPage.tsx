import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { quizQuestions } from '@/data/mockData';
import { useRouter } from '@/context/RouterContext';

export function QuizPage() {
  const { navigate } = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const q = quizQuestions[index];
  const isCorrect = selected === q.answerIndex;
  const isLast = index === quizQuestions.length - 1;
  const finished = index >= quizQuestions.length;

  const choose = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    setIndex((n) => n + 1);
    setSelected(null);
    setRevealed(false);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
  };

  if (finished) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-16 text-center sm:px-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Diagnostic complete</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          You scored <span className="font-bold text-slate-900 dark:text-white">{score}/{quizQuestions.length}</span>. Your
          readiness score and study plan have been updated.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" /> Retake
          </button>
          <button
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
          >
            See your readiness <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="eyebrow">Diagnostic Quiz</span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Question {index + 1} of {quizQuestions.length}
          </h1>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {q.domain}
        </span>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-700 dark:bg-indigo-500"
          style={{ width: `${(index / quizQuestions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bento-card"
        >
          <p className="text-lg font-semibold leading-relaxed text-slate-900 dark:text-white">{q.question}</p>

          <div className="mt-5 space-y-3">
            {q.options.map((opt, i) => {
              const correct = i === q.answerIndex;
              const picked = i === selected;
              let cls = 'border-slate-200 bg-white hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-600';
              let icon = null;
              if (revealed && correct) {
                cls = 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40';
                icon = <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
              } else if (revealed && picked && !correct) {
                cls = 'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/40';
                icon = <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
              }
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all ${cls} ${
                    !revealed ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span className="text-slate-800 dark:text-slate-100">{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-4 rounded-xl p-4 text-sm leading-relaxed ${
                isCorrect
                  ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                  : 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200'
              }`}
            >
              <p className="mb-1 font-bold">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
              {q.explanation}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {revealed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-end">
          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
          >
            {isLast ? 'Finish' : 'Next question'} <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
