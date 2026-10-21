import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { seedQuestions } from '@/data/seedQuestions';
import { useRouter } from '@/context/RouterContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

export function QuizPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [questions, setQuestions] = useState(seedQuestions.slice(0, 12));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .limit(20);

        if (data && data.length > 0 && !error) {
          setQuestions(
            data.map((q) => ({
              id: q.id,
              domain_id: q.domain_id,
              topic_id: q.topic_id,
              objective: q.objective,
              question: q.question,
              options: q.options,
              answerIndex: q.correct_index,
              explanation: q.explanation,
              learnUrl: q.learn_url,
            }))
          );
        }
      } catch (err) {
        console.warn('Using embedded question bank:', err);
      }
    }

    loadQuestions();
  }, []);

  const q = questions[index] || questions[0];
  const isCorrect = selected === q.answerIndex;
  const isLast = index === questions.length - 1;
  const finished = index >= questions.length;

  const domainLabel =
    q.domain_id === 1
      ? 'Cloud Concepts'
      : q.domain_id === 2
      ? 'Azure Architecture & Services'
      : 'Azure Management & Governance';

  const choose = async (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === q.answerIndex;
    if (correct) setScore((s) => s + 1);

    // Save attempt directly to Supabase if user exists
    if (user?.id) {
      const attemptRecord = {
        user_id: user.id,
        question_id: q.id,
        domain_id: q.domain_id || 1,
        topic_id: q.topic_id || 'general',
        selected_index: i,
        is_correct: correct,
        mode: 'practice',
      };

      try {
        await supabase.from('attempts').insert([attemptRecord]);
      } catch (err) {
        console.warn('Attempt save notice:', err);
      }

      // If wrong, create or update flashcard for Leitner spaced repetition
      if (!correct) {
        try {
          await supabase.from('flashcards').insert([
            {
              user_id: user.id,
              question_id: q.id,
              front: q.question,
              back: `${q.options[q.answerIndex]}\n\n💡 ${q.explanation}`,
              domain: domainLabel,
              box: 1,
              next_review: new Date().toISOString(),
              source: 'missed_quiz',
            },
          ]);
        } catch (err) {
          console.warn('Flashcard creation notice:', err);
        }
      }
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
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-xl px-5 py-12 text-center sm:px-6 sm:py-20">
        <div className="bento-card p-8 sm:p-10">
          <span className="eyebrow">Quiz completed</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            You scored {score} of {questions.length} ({pct}%)
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {pct >= 80
              ? 'Excellent! You demonstrated strong mastery of these fundamentals.'
              : 'Keep practicing! Review missed concepts in flashcards to lift your score.'}
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
          <span className="eyebrow">{domainLabel}</span>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Question {index + 1} of {questions.length}
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
              let style =
                'border-slate-200 bg-slate-50/60 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800';

              if (revealed) {
                if (isAnswer) {
                  style =
                    'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold';
                } else if (isPicked) {
                  style =
                    'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200';
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
                  <span className="flex-1 leading-snug">{opt}</span>
                  {revealed && isAnswer && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {revealed && isPicked && !isAnswer && (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-850"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Sparkles className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
                <span>Explanation</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {q.explanation}
              </p>
              {q.learnUrl && (
                <a
                  href={q.learnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" /> Read Microsoft Learn guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </motion.div>
          )}

          {revealed && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={next}
                className="flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
              >
                {isLast ? 'Complete Quiz' : 'Next Question'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
