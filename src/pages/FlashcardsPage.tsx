import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { flashcards } from '@/data/mockData';
import { useRouter } from '@/context/RouterContext';

export function FlashcardsPage() {
  const { navigate } = useRouter();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  const card = flashcards[index];

  const go = (dir: number) => {
    setFlipped(false);
    setIndex((n) => (n + dir + flashcards.length) % flashcards.length);
  };

  const markKnown = () => {
    setKnown((s) => new Set(s).add(card.id));
    go(1);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="eyebrow">Flashcards</span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Card {index + 1} of {flashcards.length}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            {known.size} known
          </span>
          <button
            onClick={restart}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-indigo-700 dark:bg-indigo-500"
          style={{ width: `${((index + 1) / flashcards.length) * 100}%` }}
        />
      </div>

      {/* Flip card */}
      <div className="relative h-80 cursor-pointer" style={{ perspective: 1200 }} onClick={() => setFlipped((f) => !f)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id + (flipped ? '-back' : '-front')}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bento-card absolute inset-0 flex h-full flex-col items-center justify-center text-center"
          >
            <span className="mb-4 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {card.domain}
            </span>
            {flipped ? (
              <>
                <p className="text-base font-medium leading-relaxed text-slate-700 dark:text-slate-200">{card.back}</p>
                <span className="mt-5 text-xs uppercase tracking-wider text-slate-400">Tap to flip back</span>
              </>
            ) : (
              <>
                <p className="text-2xl font-extrabold leading-snug tracking-tight text-slate-900 dark:text-white">
                  {card.front}
                </p>
                <span className="mt-5 text-xs uppercase tracking-wider text-slate-400">Tap to reveal answer</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => go(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => go(1)}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Skip
          </button>
          <button
            onClick={markKnown}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 dark:bg-emerald-500"
          >
            I knew this
          </button>
        </div>

        <button
          onClick={() => go(1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Volume2 className="h-3.5 w-3.5" />
        <span>Tip: explain the card out loud — then flip to check.</span>
        <button onClick={() => navigate('buddy')} className="font-semibold text-indigo-700 dark:text-indigo-400">
          Ask the buddy
        </button>
      </div>
    </div>
  );
}
