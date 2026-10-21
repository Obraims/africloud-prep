import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Send, Sparkles } from 'lucide-react';
import { chatHistory, type ChatMessage } from '@/data/mockData';

const languages = ['English', 'Kiswahili', 'Sheng'] as const;
type Language = (typeof languages)[number];

const langFlag: Record<Language, string> = {
  English: 'EN',
  Kiswahili: 'SW',
  Sheng: 'SH',
};

export function BuddyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [draft, setDraft] = useState('');
  const [lang, setLang] = useState<Language>('English');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', text, lang };
    setMessages((m) => [...m, userMsg]);
    setDraft('');
    setTyping(true);

    window.setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        role: 'ai',
        text:
          lang === 'Kiswahili'
            ? 'Sawa! Hebu tuchunguze hili. Fikiria kama inavyofanya kazi kama mfumo wa matatu wa Nairobi — kila gari lina njia yake lakini wote wanakaa kwenye kituo kimoja cha kuondokea. Cloud inafanya kazi vivyo hivyo.'
            : lang === 'Sheng'
              ? 'Eish! Hii ni swali poa. Fikiria kama cloud ni kama SACCO ya wafanyabiashara — kila mtu anachanga pesa lakini mtu mmoja anaitisha, na kama mtu mmoja ashindwa, wengine bado wako strong.'
              : 'Great question! Think of it like the Nairobi matatu system — every route has its own vehicle, but they all share one central stage. Cloud resources work the same way: independent, but coordinated. Want me to tie this to a specific AZ-900 concept?',
        lang,
      };
      setMessages((m) => [...m, aiMsg]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white dark:bg-indigo-500">
          <Bot className="h-5.5 w-5.5" strokeWidth={2.2} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Study Buddy</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online · explains cloud with local analogies
          </p>
        </div>
      </div>

      {/* Chat surface */}
      <div className="bento-card flex h-[calc(100vh-340px)] min-h-[420px] flex-col p-0 overflow-hidden">
        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'ai' && (
                  <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-indigo-700 text-white dark:bg-indigo-600'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                  }`}
                >
                  {m.text}
                  <span
                    className={`mt-1.5 block text-[10px] uppercase tracking-wider ${
                      m.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {m.lang}
                  </span>
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500"
                      style={{ animation: `pulse 1s ${i * 0.2}s infinite` }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Composer */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`relative rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    lang === l ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {lang === l && (
                    <motion.span
                      layoutId="lang-pill"
                      className="absolute inset-0 rounded-full bg-indigo-700 dark:bg-indigo-500"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-1">
                    {l}
                    {lang === l && <Check className="h-3 w-3" />}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={`Message your buddy in ${lang} (${langFlag[lang]})…`}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-700 text-white transition-transform hover:scale-[1.05] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-indigo-600"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
