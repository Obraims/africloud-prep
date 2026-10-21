import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, Send, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const languages = ['English', 'Kiswahili', 'Sheng'];

const langFlag = {
  English: 'EN',
  Kiswahili: 'SW',
  Sheng: 'SH',
};

const INITIAL_GREETING = {
  id: 'init-1',
  role: 'ai',
  text: 'Jambo! I am Mwalimu, your AZ-900 Study Buddy. Ask me any Azure concept and I will break it down using real-life Kenyan analogies — M-Pesa agents, matatus, SACCO locks, or county by-laws. You can chat in English, Kiswahili, or Sheng!',
  lang: 'English',
};

export function BuddyPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [draft, setDraft] = useState('');
  const [lang, setLang] = useState('English');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function loadUserMessages() {
      if (user?.id) {
        try {
          const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

          if (data && data.length > 0) {
            setMessages(
              data.map((m) => ({
                id: m.id,
                role: m.role,
                text: m.text,
                lang: m.lang || 'English',
              }))
            );
          }
        } catch (e) {
          console.warn('Chat load notice:', e);
        }
      }
    }
    loadUserMessages();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    const text = draft.trim();
    if (!text) return;
    const userMsg = { id: `u${Date.now()}`, role: 'user', text, lang };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setDraft('');
    setTyping(true);

    if (user?.id) {
      try {
        await supabase.from('chat_messages').insert([
          {
            user_id: user.id,
            role: 'user',
            text,
            lang,
          },
        ]);
      } catch (e) {
        console.warn('Could not persist user message:', e);
      }
    }

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
          setTyping(false);

          if (user?.id) {
            await supabase.from('chat_messages').insert([
              {
                user_id: user.id,
                role: 'ai',
                text: data.reply,
                lang,
              },
            ]);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Edge function invoke notice:', e);
    }

    // High fidelity 3-part Kenyan analogy fallback engine
    setTimeout(async () => {
      let replyText = '';
      const q = text.toLowerCase();

      if (q.includes('zone') || q.includes('availability')) {
        if (lang === 'Kiswahili') {
          replyText =
            'Availability Zone ni eneo lililotengwa kimwili ndani ya Azure region lenye stima na mtandao wake huru.\n\nFikiria maduka mawili ya wakala wa M-Pesa mtaani: moja likikosa stima, bado unapata huduma kwenye duka lingine mtaa wa pili.\n\nKwenye Azure, ukisambaza virtual machines zako kwenye Availability Zones tofauti, hitilafu ya jengo moja haitafunga app yako.\n\nSwali la kujipima: Ukiweka VMs zako kwenye zone moja pekee, nini kitatokea zone hiyo ikikosa umeme?';
        } else if (lang === 'Sheng') {
          replyText =
            'Availability Zone ni base imejitegemea physically ndani ya Azure region ikiwa na stima na neti yake yenyewe.\n\nNi kama kuwa na ma-agent wawili wa M-Pesa mtaani — mmoja Westlands na mwingine Upper Hill. Ya Westy ikilala, Upper Hill inachapa kazi fiti.\n\nKwa Azure, unagawa VMs zako across Availability Zones ndio hata stima ikikatika tao, biz yako inastay alive bila glitch.\n\nSwali la kujipima: Zone moja ikilala na uliweka system nzima hapo, app inabaki ama inazama?';
        } else {
          replyText =
            'An Availability Zone is a physically separate location inside an Azure region with independent power, cooling, and networking.\n\nThink of three separate M-Pesa agent shops on different streets in one town. If one shop closes due to a blackout, you can still withdraw cash at the other shop across the street.\n\nIn Azure, deploying virtual machines across multiple Availability Zones protects your application from datacenter-level failure.\n\nQuick check: If you deploy all your VMs in a single Availability Zone, what happens if that datacenter facility fails?';
        }
      } else {
        if (lang === 'Kiswahili') {
          replyText =
            'Huu ni msingi muhimu wa mtihani wa AZ-900 unaohusu rasilimali za Microsoft Azure.\n\nFikiria ushirikiano wa biashara ya matatu: mmiliki anasimamia gari na bima (provider), naye dereva anasimamia safari na abiria (customer). Kila mtu ana wajibu wake unaoeleweka.\n\nKwenye Azure, huduma kama Azure Policy, Resource Locks, na RBAC zinalinda na kusimamia mifumo yako yote kwa usahihi.\n\nSwali la kujipima: Chini ya Shared Responsibility Model, nani anawajibika kulinda data ya wateja: mteja au Microsoft?';
        } else if (lang === 'Sheng') {
          replyText =
            'Hii risto ni key sana kwa AZ-900 ya Azure cloud fundamentals.\n\nFikiria matatu ya mtaa: mwenye gari anahakikisha gari iko roadworthy na bima, lakini dereva anadrive na kuitisha fare. Kwa cloud pia kuna Shared Responsibility Model.\n\nKwa Azure, huduma kama Azure Policy na Microsoft Entra ID zinalinda system yako isidondoke ovyo.\n\nSwali la kujipima: Nani anabeba mzigo wa passwords na customer data: wewe mwenyewe ama Microsoft?';
        } else {
          replyText =
            'This concept is a core pillar of the Microsoft Azure Fundamentals (AZ-900) curriculum.\n\nThink of a SACCO office: Azure Policy is the county by-laws that every branch must follow, while Azure RBAC is deciding which staff member holds the keys to the cash vault.\n\nIn Azure, use Azure Policy for resource governance compliance, and Azure RBAC to manage identity permissions across subscriptions.\n\nQuick check: Which service controls who has access to an Azure subscription: Azure Policy or Azure RBAC?';
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
      setTyping(false);

      if (user?.id) {
        try {
          await supabase.from('chat_messages').insert([
            {
              user_id: user.id,
              role: 'ai',
              text: replyText,
              lang,
            },
          ]);
        } catch (e) {
          console.warn('Could not persist AI reply:', e);
        }
      }
    }, 700);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-700 text-white shadow-soft dark:bg-indigo-600">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Study Buddy (Mwalimu)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Kenyan analogies for Microsoft Azure concepts
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {languages.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                lang === l
                  ? 'bg-indigo-700 text-white shadow-sm dark:bg-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {langFlag[l]} {l}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bento-card flex h-[500px] flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-700 text-white dark:bg-indigo-600'
                      : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-200 whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-850">
                Mwalimu is thinking in {lang}...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-3.5 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask in ${lang} (e.g. "Availability zones ni nini?")`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40 dark:bg-indigo-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
