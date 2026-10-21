import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Send, Sparkles } from 'lucide-react';
import { chatHistory } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const languages = ['English', 'Kiswahili', 'Sheng'];

const langFlag = {
  English: 'EN',
  Kiswahili: 'SW',
  Sheng: 'SH',
};

export function BuddyPage() {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('cm_chat_history');
    return stored ? JSON.parse(stored) : chatHistory;
  });
  const [draft, setDraft] = useState('');
  const [lang, setLang] = useState('English');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    const userMsg = { id: `u${Date.now()}`, role: 'user', text, lang };
    const updated = [...messages, userMsg];
    setMessages(updated);
    localStorage.setItem('cm_chat_history', JSON.stringify(updated));
    setDraft('');
    setTyping(true);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.functions.invoke('buddy-chat', {
          body: { message: text, language: lang },
        });

        if (data?.reply && !error) {
          const aiMsg = {
            id: `a${Date.now()}`,
            role: 'ai',
            text: data.reply,
            lang,
          };
          const next = [...updated, aiMsg];
          setMessages(next);
          localStorage.setItem('cm_chat_history', JSON.stringify(next));
          setTyping(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Edge function invoke failed, using Kenyan analogy fallback:', e);
    }

    // Local 3-part Kenyan analogy fallback engine
    setTimeout(() => {
      let replyText = '';
      const q = text.toLowerCase();

      if (q.includes('zone') || q.includes('availability')) {
        if (lang === 'Kiswahili') {
          replyText = 'Availability Zone ni eneo lililotengwa kimwili ndani ya Azure region lenye stima na mtandao wake huru.\n\nFikiria maduka mawili ya wakala wa M-Pesa mtaani: moja likikosa stima, bado unapata huduma kwenye duka lingine mtaa wa pili.\n\nKwenye Azure, ukisambaza virtual machines zako kwenye Availability Zones tofauti, hitilafu ya jengo moja haitafunga app yako.\n\nSwali la kujipima: Ukiweka VMs zako kwenye zone moja pekee, nini kitatokea zone hiyo ikikosa umeme?';
        } else if (lang === 'Sheng') {
          replyText = 'Availability Zone ni base imejitegemea physically ndani ya Azure region ikiwa na stima na neti yake yenyewe.\n\nNi kama kuwa na ma-agent wawili wa M-Pesa mtaani — mmoja Westlands na mwingine Upper Hill. Ya Westy ikilala, Upper Hill inachapa kazi fiti.\n\nKwa Azure, unagawa VMs zako across Availability Zones ndio hata stima ikikatika tao, biz yako inastay alive bila glitch.\n\nSwali la kujipima: Zone moja ikilala na uliweka system nzima hapo, app inabaki ama inazama?';
        } else {
          replyText = 'An Availability Zone is a physically separate location inside an Azure region with independent power, cooling, and networking.\n\nThink of three separate M-Pesa agent shops on different streets in one town. If one shop closes due to a blackout, you can still withdraw cash at the other shop across the street.\n\nIn Azure, deploying virtual machines across multiple Availability Zones protects your application from datacenter-level failure.\n\nQuick check: If you deploy all your VMs in a single Availability Zone, what happens if that datacenter facility fails?';
        }
      } else {
        if (lang === 'Kiswahili') {
          replyText = 'Huu ni msingi muhimu wa mtihani wa AZ-900 unaohusu rasilimali za Microsoft Azure.\n\nFikiria ushirikiano wa biashara ya matatu: mmiliki anasimamia gari na bima (provider), naye dereva anasimamia safari na abiria (customer). Kila mtu ana wajibu wake unaoeleweka.\n\nKwenye Azure, huduma kama Azure Policy, Resource Locks, na RBAC zinalinda na kusimamia mifumo yako yote kwa usahihi.\n\nSwali la kujipima: Chini ya Shared Responsibility Model, nani anawajibika kulinda data ya wateja: mteja au Microsoft?';
        } else if (lang === 'Sheng') {
          replyText = 'Hii risto ni key sana kwa AZ-900 ya Azure cloud fundamentals.\n\nFikiria matatu ya mtaa: mwenye gari anahakikisha gari iko roadworthy na bima, lakini dereva anadrive na kuitisha fare. Kwa cloud pia kuna Shared Responsibility Model.\n\nKwa Azure, huduma kama Azure Policy na Microsoft Entra ID zinalinda system yako isidondoke ovyo.\n\nSwali la kujipima: Nani anabeba mzigo wa passwords na customer data: wewe mwenyewe ama Microsoft?';
        } else {
          replyText = 'This concept is a core pillar of the Microsoft Azure Fundamentals (AZ-900) curriculum.\n\nThink of a SACCO office: Azure Policy is the county by-laws that every branch must follow, while Azure RBAC is deciding which staff member holds the keys to the cash vault.\n\nIn Azure, use Azure Policy for resource governance compliance, and Azure RBAC to manage identity permissions across subscriptions.\n\nQuick check: Which service controls who has access to an Azure subscription: Azure Policy or Azure RBAC?';
        }
      }

      const aiMsg = {
        id: `a${Date.now()}`,
        role: 'ai',
        text: replyText,
        lang,
      };
      const next = [...updated, aiMsg];
      setMessages(next);
      localStorage.setItem('cm_chat_history', JSON.stringify(next));
      setTyping(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white dark:bg-indigo-500">
          <Bot className="h-5.5 w-5.5" strokeWidth={2.2} />
        </span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Study Buddy (CloudMwalimu)</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Online • 3-part answers with local Kenyan analogies
          </p>
        </div>
      </div>

      {/* Chat Surface */}
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-indigo-700 text-white dark:bg-indigo-600'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
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
              placeholder={
                lang === 'Kiswahili'
                  ? 'Uliza chochote kuhusu AZ-900 (SW)...'
                  : lang === 'Sheng'
                  ? 'Uliza rada ya Azure (SH)...'
                  : 'Message your study buddy in English (EN)...'
              }
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
