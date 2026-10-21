import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Check, Sparkles } from 'lucide-react';
import { flashcards as initialCards } from '@/data/mockData';
import { useRouter } from '@/context/RouterContext';
import { advanceCard, isCardDue, LEITNER_INTERVALS_DAYS } from '@/lib/leitner';

export function FlashcardsPage() {
  const { navigate } = useRouter();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('cm_flashcards');
    if (stored) {
      setCards(JSON.parse(stored));
    } else {
      setCards(initialCards);
      localStorage.setItem('cm_flashcards', JSON.stringify(initialCards));
    }
  }, []);

  const cardList = cards.length > 0 ? cards : initialCards;
  const card = cardList[index] || cardList[0];

  const go = (dir) => {
    setFlipped(false);
    setIndex((n) => (n + dir + cardList.length) % cardList.length);
  };

  const markKnown = () => {
    if (!card) return;
    const updated = advanceCard(card, true);
    const newCards = cardList.map((c) => (c.id === card.id ? updated : c));
    setCards(newCards);
    localStorage.setItem('cm_flashcards', JSON.stringify(newCards));
    setKnown((s) => new Set(s).add(card.id));
    go(1);
  };

  const markRetry = () => {
    if (!card) return;
    const updated = advanceCard(card, false);
    const newCards = cardList.map((c) => (c.id === card.id ? updated : c));
    setCards(newCards);
    localStorage.setItem('cm_flashcards', JSON.stringify(newCards));
    go(1);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  };

  // Keyboard navigation: Space to flip, 1 to retry, 2 for got it
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === '1' && flipped) {
        e.preventDefault();
        markRetry();
      } else if (e.key === '2' && flipped) {
        e.preventDefault();
        markKnown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, flipped]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="eyebrow">Flashcards (Leitner 5-Box)</span>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Card {index + 1} of {cardList.length} • Box {card?.box || 1} ({LEITNER_INTERVALS_DAYS[card?.box || 1]}d interval)
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Mastered: {known.size} / {cardList.length}
        </span>
      </div>

      {/* Card Surface */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="bento-card relative flex min-h-[320px] cursor-pointer flex-col justify-between p-8 transition-transform hover:scale-[1.01] active:scale-[0.99] select-none"
      >
        <div className="flex items-center justify-between">
          <span className="eyebrow">{card?.domain}</span>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
            {flipped ? 'Answer' : 'Question (Click to flip)'}
          </span>
        </div>

        <div className="my-auto py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={flipped ? 'back' : 'front'}
              initial={{ opacity: 0, rotateX: -15 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 15 }}
              transition={{ duration: 0.2 }}
            >
              {flipped ? (
                <p className="text-base font-medium leading-relaxed text-slate-700 sm:text-lg dark:text-slate-200 whitespace-pre-line">
                  {card?.back}
                </p>
              ) : (
                <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                  {card?.front}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-850 dark:text-slate-500">
          <span>Shortcuts: Space (Flip), 1 (Retry), 2 (Got it)</span>
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">{flipped ? 'Click to show front' : 'Click to reveal'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous card"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next card"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={markRetry}
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
          >
            Retry [1]
          </button>
          <button
            onClick={markKnown}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 dark:bg-indigo-600"
          >
            <Check className="h-4 w-4" /> Got it [2]
          </button>
        </div>
      </div>
    </div>
  );
}
