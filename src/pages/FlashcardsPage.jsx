import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Check, Sparkles } from 'lucide-react';
import { defaultFlashcards } from '@/data/seedQuestions';
import { useRouter } from '@/context/RouterContext';
import { advanceCard, isCardDue, LEITNER_INTERVALS_DAYS } from '@/lib/leitner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export function FlashcardsPage() {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());

  useEffect(() => {
    async function loadFlashcards() {
      if (user?.id) {
        try {
          const { data } = await supabase
            .from('flashcards')
            .select('*')
            .eq('user_id', user.id);

          if (data && data.length > 0) {
            setCards(data);
            return;
          }
        } catch (e) {
          console.warn('Flashcard fetch notice:', e);
        }
      }
      setCards(defaultFlashcards);
    }

    loadFlashcards();
  }, [user]);

  const cardList = cards.length > 0 ? cards : defaultFlashcards;
  const card = cardList[index] || cardList[0];

  const go = (dir) => {
    setFlipped(false);
    setIndex((n) => (n + dir + cardList.length) % cardList.length);
  };

  const markKnown = async () => {
    if (!card) return;
    const updated = advanceCard(card, true);
    const newCards = cardList.map((c) => (c.id === card.id ? updated : c));
    setCards(newCards);
    setKnown((s) => new Set(s).add(card.id));

    if (user?.id && card.user_id) {
      try {
        await supabase
          .from('flashcards')
          .update({
            box: updated.box,
            next_review: updated.next_review,
            updated_at: new Date().toISOString(),
          })
          .eq('id', card.id);
      } catch (e) {
        console.warn('Card sync notice:', e);
      }
    }

    go(1);
  };

  const markRetry = async () => {
    if (!card) return;
    const updated = advanceCard(card, false);
    const newCards = cardList.map((c) => (c.id === card.id ? updated : c));
    setCards(newCards);

    if (user?.id && card.user_id) {
      try {
        await supabase
          .from('flashcards')
          .update({
            box: updated.box,
            next_review: updated.next_review,
            updated_at: new Date().toISOString(),
          })
          .eq('id', card.id);
      } catch (e) {
        console.warn('Card sync notice:', e);
      }
    }

    go(1);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === '1') {
        markRetry();
      } else if (e.key === '2') {
        markKnown();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cardList, index, flipped]);

  if (!card) return null;

  return (
    <div className="mx-auto max-w-xl px-5 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="eyebrow">{card.domain || 'Cloud Concepts'}</span>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Card {index + 1} of {cardList.length} • Box {card.box || 1}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Known: {known.size}</span>
        </div>
      </div>

      {/* Flip Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="group relative h-80 w-full cursor-pointer perspective-1000"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bento-card relative flex h-full w-full flex-col justify-between p-8 text-center preserve-3d shadow-lifted"
        >
          {!flipped ? (
            <div className="flex h-full flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Question
              </span>
              <p className="my-auto text-lg font-bold leading-relaxed text-slate-900 sm:text-xl dark:text-white">
                {card.front}
              </p>
              <p className="text-xs text-slate-400">Click or press Space to reveal answer</p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between [transform:rotateY(180deg)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Answer & Explanation
              </span>
              <p className="my-auto text-sm leading-relaxed text-slate-700 sm:text-base dark:text-slate-200 whitespace-pre-line">
                {card.back}
              </p>
              <p className="text-xs text-slate-400">Press 1 for Retry, 2 for Got it</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => go(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex flex-1 items-center justify-center gap-3">
          <button
            onClick={markRetry}
            className="flex-1 rounded-xl border border-rose-200 bg-rose-50/80 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
          >
            Review Soon (1)
          </button>
          <button
            onClick={markKnown}
            className="flex-1 rounded-xl bg-indigo-700 py-3 text-xs font-bold text-white shadow-soft hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Got It! (2)
          </button>
        </div>

        <button
          onClick={() => go(1)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
