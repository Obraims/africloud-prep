import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { quizQuestions } from '@/data/mockData';
import { useRouter } from '@/context/RouterContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export function QuizPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const q = quizQuestions[index] || quizQuestions[0];
  const isCorrect = selected === q.answerIndex;
  const isLast = index === quizQuestions.length - 1;
  const finished = index >= quizQuestions.length;

  const choose = async (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === q.answerIndex;
    if (correct) setScore((s) => s + 1);

    // Save attempt to local storage & Supabase
    const attempt = {
      id: `att-${Date.now()}`,
      user_id: user?.id || 'demo-user',
      question_id: q.id,
      domain_id: q.domain_id || 1,
      domain: q.domain,
      selected_index: i,
      is_correct: correct,
      created_at: new Date().toISOString(),
    };

    const stored = JSON.parse(localStorage.getItem('cm_attempts') || '[]');
    stored.push(attempt);
    localStorage.setItem('cm_attempts', JSON.stringify(stored));

    if (isSupabaseConfigured() && user?.id) {
      await supabase.from('attempts').insert([attempt]).catch(console.warn);
    }

    // If wrong, add flashcard
    if (!correct) {
      const card = {
        id: `f-${q.id}-${Date.now()}`,
        user_id: user?.id || 'demo-user',
        front: q.question,
        back: `${q.options[q.answerIndex]}\n\n💡 ${q.explanation}`,
        domain: q.domain,
        box: 1,
        next_review: new Date().toISOString(),
      };
      const cards = JSON.parse(localStorage.getItem('cm_flashcards') || '[]');
      cards.push(card);
      localStorage.setItem('cm_flashcards', JSON.stringify(cards));
    }
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
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="mx-auto max-w-xl px-5 py-12 text-center sm:px-6 sm:py-20">
        <div className="bento-card p-8 sm:p-10">
          <span className="eyebrow">Quiz completed</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            You scored {score} of {quizQuestions.length} ({pct}%)
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {pct >= 80 ? 'Excellent! You demonstrated strong mastery of these fundamentals.' : 'Keep practicing! Review missed concepts in flashcards to lift your score.'}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={restart}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
            <button
              onClick={() => navigate('dashboard')}
              className="rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="eyebrow">{q.domain}</span>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Question {index + 1} of {quizQuestions.length}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Score: {score}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3 }}
          className="bento-card p-6 sm:p-8"
        >
          <h2 className="text-lg font-bold leading-relaxed text-slate-900 sm:text-xl dark:text-white">
            {q.question}
          </h2>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, i) => {
              const isPicked = selected === i;
              const isAnswer = i === q.answerIndex;
              let style = 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800';

              if (revealed) {
                if (isAnswer) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold';
                } else if (isPicked) {
                  style = 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200';
                } else {
                  style = 'border-slate-200/50 opacity-40 dark:border-slate-800/50';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  disabled={revealed}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm transition-colors ${style}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div className="flex-1">
                    <span>{opt}</span>
                    {revealed && q.wrong_explanations && (
                      <p className="mt-1 text-xs opacity-90 font-normal">
                        {isAnswer ? (
                          <span className="text-emerald-700 dark:text-emerald-300">✓ {q.explanation}</span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400">✕ {q.wrong_explanations[i]}</span>
                        )}
                      </p>
                    )}
                  </div>
                  {revealed && isAnswer && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
                  {revealed && isPicked && !isAnswer && <XCircle className="h-5 w-5 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {q.learn_url && (
                    <a
                      href={q.learn_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:underline dark:text-indigo-400"
                    >
                      <span>Microsoft Learn</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => navigate('buddy')}
                    className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    <Sparkles className="h-3 w-3" /> Explain with Buddy
                  </button>
                </div>

                <button
                  onClick={next}
                  className="flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
                >
                  {isLast ? 'See results' : 'Next question'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
