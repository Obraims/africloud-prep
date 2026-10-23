import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, CheckCircle2, Send, Target, Trash2, XCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { isGeminiConfigured, askGeminiStudyBuddy } from '@/lib/geminiClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/context/RouterContext';
import { seedQuestions } from '@/data/seedQuestions';

const languages = ['English', 'Kiswahili', 'Sheng'];

const langFlag = {
  English: 'EN',
  Kiswahili: 'SW',
  Sheng: 'SH',
};

const GREETINGS = {
  English: {
    id: 'init-1',
    role: 'ai',
    text: 'Jambo! I am your AfriCloud Prep AZ-900 Study Buddy. Ask me any Azure concept and I will break it down using real-life Kenyan analogies - M-Pesa agents, matatus, SACCO locks, or county by-laws. You can chat in English, Kiswahili, or Sheng!\n\nTap any quick topic below or type your question to start.',
    lang: 'English',
  },
  Kiswahili: {
    id: 'init-1',
    role: 'ai',
    text: 'Jambo! Mimi ni Study Buddy wako wa AfriCloud Prep kwa mtihani wa AZ-900. Niulize dhana yoyote ya Azure nami nitaifafanua kwa mifano halisi ya Kenya - mawakala wa M-Pesa, matatu, sefu za SACCO, au sheria za kaunti. Unaweza kuongea nami kwa Kiingereza, Kiswahili, au Sheng!\n\nBofya mada yoyote hapa chini au andika swali lako kuanza.',
    lang: 'Kiswahili',
  },
  Sheng: {
    id: 'init-1',
    role: 'ai',
    text: 'Niaje! Mimi ni Study Buddy wako wa AfriCloud Prep wa AZ-900. Niulize risto yoyote ya Azure nitakuwekea na ma-analogy za mtaani - ma-agent wa M-Pesa, matatu, SACCO locks, na ma-rule za county. Unaweza bonga nami in English, Kiswahili, ama Sheng!\n\nGonga topic yoyote hapo chini ama drop swali uanze kutesa.',
    lang: 'Sheng',
  },
};

const INITIAL_GREETING = GREETINGS.English;

const SUGGESTED_PROMPTS = [
  {
    label: '🌍 Availability Zones',
    prompt: 'Explain Azure Availability Zones using an M-Pesa analogy',
  },
  {
    label: '🚌 Shared Responsibility',
    prompt: 'How does the Shared Responsibility Model work? Use a matatu analogy',
  },
  {
    label: '💰 CapEx vs OpEx',
    prompt: 'What is the difference between CapEx and OpEx in cloud computing?',
  },
  {
    label: '🛡️ NSG vs Azure Firewall',
    prompt: 'Differentiate between Network Security Groups and Azure Firewall',
  },
  {
    label: '📦 Azure Storage Tiers',
    prompt: 'Explain Hot, Cool, and Archive Blob Storage tiers in Sheng',
  },
];

function findMatchingQuestion(text = '') {
  const t = text.toLowerCase();
  const matched = seedQuestions.find((q) => {
    const qText = `${q.question} ${q.objective || ''} ${q.topic_id || ''}`.toLowerCase();
    if (t.includes('zone') || t.includes('availability') || t.includes('redundancy')) {
      return qText.includes('zone') || qText.includes('redundancy');
    }
    if (
      t.includes('storage') ||
      t.includes('blob') ||
      t.includes('tier') ||
      t.includes('archive')
    ) {
      return qText.includes('storage') || qText.includes('blob');
    }
    if (
      t.includes('shared responsibility') ||
      t.includes('responsibility') ||
      t.includes('matatu')
    ) {
      return qText.includes('shared responsibility');
    }
    if (
      t.includes('iaas') ||
      t.includes('paas') ||
      t.includes('saas') ||
      t.includes('service model')
    ) {
      return qText.includes('iaas') || qText.includes('paas') || qText.includes('saas');
    }
    if (
      t.includes('capex') ||
      t.includes('opex') ||
      t.includes('expenditure') ||
      t.includes('cost')
    ) {
      return qText.includes('capex') || qText.includes('opex') || qText.includes('capital');
    }
    if (
      t.includes('policy') ||
      t.includes('lock') ||
      t.includes('rbac') ||
      t.includes('governance')
    ) {
      return qText.includes('policy') || qText.includes('lock') || qText.includes('role');
    }
    if (
      t.includes('firewall') ||
      t.includes('nsg') ||
      t.includes('security') ||
      t.includes('ddos')
    ) {
      return (
        qText.includes('firewall') || qText.includes('security group') || qText.includes('nsg')
      );
    }
    return false;
  });

  if (matched) return matched;
  const randomIndex = Math.floor(Math.random() * Math.min(25, seedQuestions.length));
  return seedQuestions[randomIndex];
}

export function BuddyPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [draft, setDraft] = useState('');
  const [lang, setLang] = useState('English');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  const saveLocalMessages = (msgs) => {
    try {
      localStorage.setItem('africloud_prep_chat_messages', JSON.stringify(msgs));
    } catch (e) {
      console.warn('Local chat save notice:', e);
    }
  };

  useEffect(() => {
    async function loadUserMessages() {
      if (!isSupabaseConfigured()) {
        try {
          const localMsgs = JSON.parse(
            localStorage.getItem('africloud_prep_chat_messages') || 'null'
          );
          if (localMsgs && Array.isArray(localMsgs) && localMsgs.length > 0) {
            setMessages(localMsgs);
            return;
          }
        } catch (e) {
          console.warn('Local chat load notice:', e);
        }
        setMessages([INITIAL_GREETING]);
        return;
      }

      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

          if (data && data.length > 0 && !error) {
            setMessages(
              data.map((m) => ({
                id: m.id,
                role: m.role,
                text: m.text,
                lang: m.lang || 'English',
                question: m.question || null,
                selectedOption: m.selected_option ?? null,
                revealed: m.revealed || false,
              }))
            );
            return;
          }
        } catch (e) {
          console.warn('Remote chat load notice:', e);
        }
      }
      setMessages([INITIAL_GREETING]);
    }
    loadUserMessages();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const clearChat = async () => {
    setMessages([INITIAL_GREETING]);
    if (!isSupabaseConfigured()) {
      localStorage.removeItem('africloud_prep_chat_messages');
    } else if (user?.id) {
      try {
        await supabase.from('chat_messages').delete().eq('user_id', user.id);
      } catch (e) {
        console.warn('Failed to clear remote chat:', e);
      }
    }
  };

  const handleQuizMe = (aiMsg) => {
    const matchedQuestion = findMatchingQuestion(aiMsg.text);
    const quizMsg = {
      id: `quiz-${Date.now()}`,
      role: 'quiz',
      topic: matchedQuestion.topic_id || 'Azure Fundamentals',
      question: matchedQuestion,
      selectedOption: null,
      revealed: false,
      lang,
    };
    const updated = [...messages, quizMsg];
    setMessages(updated);
    if (!isSupabaseConfigured()) {
      saveLocalMessages(updated);
    }
  };

  const handleAnswerQuiz = async (msgId, q, selectedIdx) => {
    const isCorrect = selectedIdx === q.answerIndex;

    const updated = messages.map((m) => {
      if (m.id === msgId) {
        return { ...m, selectedOption: selectedIdx, revealed: true };
      }
      return m;
    });
    setMessages(updated);
    if (!isSupabaseConfigured()) {
      saveLocalMessages(updated);
    }

    const attemptRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: user?.id || 'demo-user',
      question_id: q.id,
      domain_id: q.domain_id || 1,
      topic_id: q.topic_id || 'general',
      selected_index: selectedIdx,
      is_correct: isCorrect,
      mode: 'study_buddy',
      created_at: new Date().toISOString(),
    };

    if (!isSupabaseConfigured()) {
      try {
        const localAttempts = JSON.parse(localStorage.getItem('africloud_prep_attempts') || '[]');
        localAttempts.unshift(attemptRecord);
        localStorage.setItem('africloud_prep_attempts', JSON.stringify(localAttempts));
      } catch (e) {
        console.warn('Attempt local save notice:', e);
      }
    } else {
      try {
        await supabase.from('attempts').insert([attemptRecord]);
      } catch (e) {
        console.warn('Remote attempt save notice:', e);
      }
    }

    if (!isCorrect) {
      const domainLabel =
        q.domain_id === 1
          ? 'Cloud Concepts'
          : q.domain_id === 2
            ? 'Azure Architecture & Services'
            : 'Azure Management & Governance';

      const cardRecord = {
        id: `card-${Date.now()}`,
        user_id: user?.id || 'demo-user',
        question_id: q.id,
        front: q.question,
        back: `${q.options[q.answerIndex]}\n\n💡 ${q.explanation}`,
        domain: domainLabel,
        box: 1,
        next_review: new Date().toISOString(),
        source: 'study_buddy_miss',
      };

      if (!isSupabaseConfigured()) {
        try {
          const localCards = JSON.parse(localStorage.getItem('africloud_prep_flashcards') || '[]');
          localCards.unshift(cardRecord);
          localStorage.setItem('africloud_prep_flashcards', JSON.stringify(localCards));
        } catch (e) {
          console.warn('Flashcard local save notice:', e);
        }
      } else {
        try {
          await supabase.from('flashcards').insert([cardRecord]);
        } catch (e) {
          console.warn('Flashcard save notice:', e);
        }
      }
    }
  };

  const send = async (overrideText) => {
    const text = (overrideText || draft).trim();
    if (!text) return;
    const userMsg = { id: `u${Date.now()}`, role: 'user', text, lang };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setDraft('');
    setTyping(true);

    if (!isSupabaseConfigured()) {
      saveLocalMessages(updated);
    } else if (user?.id) {
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

    // 1. Live AfriCloud AI (Gemini client execution)
    if (isGeminiConfigured()) {
      try {
        const replyText = await askGeminiStudyBuddy({
          message: text,
          language: lang,
          learnerContext: user?.id ? `Learner user ${user.id}` : '',
        });

        if (replyText) {
          const aiMsg = {
            id: `a${Date.now()}`,
            role: 'ai',
            text: replyText,
            lang,
          };
          const next = [...updated, aiMsg];
          setMessages(next);
          setTyping(false);

          if (!isSupabaseConfigured()) {
            saveLocalMessages(next);
          } else if (user?.id) {
            try {
              await supabase.from('chat_messages').insert([
                {
                  user_id: user.id,
                  role: 'ai',
                  text: replyText,
                  lang,
                },
              ]);
            } catch (err) {
              console.warn('Chat persistence notice:', err);
            }
          }
          return;
        }
      } catch (geminiError) {
        console.warn('Live Gemini AI query failed, falling back to edge/offline engine:', geminiError);
      }
    }

    // 2. Supabase Edge Function fallback if deployed
    if (isSupabaseConfigured()) {
      try {
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
      } catch (e) {
        console.warn('Edge function invoke notice:', e);
      }
    }

    // High-fidelity Kenyan analogy engine for offline & demo mode
    setTimeout(async () => {
      let replyText = '';
      const q = text.toLowerCase();

      if (q.includes('zone') || q.includes('availability') || q.includes('redundancy')) {
        if (lang === 'Kiswahili') {
          replyText =
            'Availability Zone ni eneo lililotengwa kimwili ndani ya Azure region lenye stima, ubaridi, na mtandao wake huru.\n\nFikiria maduka mawili ya wakala wa M-Pesa mtaani: moja likikosa stima au kuezekwa upya, bado unatoa pesa kwenye duka lingine lililopo mtaa wa pili bila kukwama.\n\nKwenye Azure, ukisambaza virtual machines zako kwenye Availability Zones tofauti, hitilafu ya jengo zima la datacenter haitafunga app yako.\n\nSwali la kujipima: Ukiweka VMs zako kwenye zone moja pekee, nini kitatokea jengo hilo likipata hitilafu ya umeme?';
        } else if (lang === 'Sheng') {
          replyText =
            'Availability Zone ni base imejitegemea physically ndani ya Azure region ikiwa na stima, cooling na neti yake yenyewe.\n\nNi kama kuwa na ma-agent wawili wa M-Pesa mtaani — mmoja Westlands na mwingine Upper Hill. Ya Westy ikilala, ya Upper Hill bado inachapa kazi fiti.\n\nKwa Azure, unagawa VMs zako across Availability Zones ndio hata stima ikikatika tao, app ya biz yako inastay alive bila glitch.\n\nSwali la kujipima: Zone moja ikilala na uliweka system nzima hapo, app inabaki ama inazama?';
        } else {
          replyText =
            'An Availability Zone is a physically separate location inside an Azure region with independent power, cooling, and networking.\n\nThink of separate M-Pesa agent shops on different streets in one town. If one shop closes due to a local power blackout, you can still withdraw cash at the other shop across the street.\n\nIn Azure, deploying virtual machines across multiple Availability Zones protects your workload from an entire datacenter outage.\n\nQuick check: If you deploy all your VMs in a single Availability Zone, what happens if that datacenter facility fails?';
        }
      } else if (
        q.includes('shared responsibility') ||
        q.includes('responsibility') ||
        q.includes('matatu')
      ) {
        if (lang === 'Kiswahili') {
          replyText =
            'Shared Responsibility Model inabainisha majukumu ya kiusalama kati ya mtoa huduma (Microsoft) na mteja.\n\nFikiria ushirikiano wa matatu: mwenye gari anahakikisha gari lina bima, mafuta na tairi safi, lakini abiria anawajibika kulinda begi na simu yake asipokonywe.\n\nKwenye Azure, Microsoft inalinda majengo na mashine za asili (physical datacenters), lakini wewe mwenyewe unawajibika kulinda akaunti, manenosiri na data zako.\n\nSwali la kujipima: Chini ya IaaS, nani anawajibika kuweka security patches kwenye mfumo wa uendeshaji (OS)?';
        } else if (lang === 'Sheng') {
          replyText =
            'Shared Responsibility Model ni mkataba wa nani anabeba mzigo gani wa usalama kati yako na Microsoft.\n\nNi kama kupanda matatu ya Rongai: mwenye nganya anahakikisha injini na brakes ziko top, lakini kulinda simu yako mfukoni ni wajibu wako mwenyewe.\n\nKwa Azure, Microsoft inalinda chuma na datacenters, lakini credentials na data za wateja ni wewe unaziweka salama.\n\nSwali la kujipima: Kwa cloud, nani ana jukumu la kulinda passwords za wafanyakazi wako?';
        } else {
          replyText =
            'The Shared Responsibility Model clearly divides security and operational duties between Microsoft and the cloud customer.\n\nThink of a matatu: the owner is responsible for roadworthiness and engine mechanics, while each passenger is responsible for their own wallet and phone.\n\nIn Azure, Microsoft always secures the physical infrastructure, while the customer remains responsible for data, identities, and device access regardless of cloud model.\n\nQuick check: Under an IaaS model, who is responsible for patching the guest operating system on a virtual machine?';
        }
      } else if (
        q.includes('capex') ||
        q.includes('opex') ||
        q.includes('expenditure') ||
        q.includes('cost')
      ) {
        if (lang === 'Kiswahili') {
          replyText =
            'CapEx ni gharama kubwa ya awali ya kununua vifaa (kama kununua matatu nzima), wakati OpEx ni gharama za uendeshaji wa kila siku kulingana na matumizi (kama kulipa nauli ya safari moja).\n\nCloud computing inaruhusu biashara kuacha CapEx kubwa na kuhamia mfumo wa OpEx ambapo unalipia tu rasilimali unazotumia kwa dakika au masaa.\n\nSwali la kujipima: Unaponunua server za kuweka ofisini kwako, hiyo ni CapEx au OpEx?';
        } else if (lang === 'Sheng') {
          replyText =
            'CapEx ni ile dau kubwa unatoa mwanzo kununua mali (kama kubuy probox ya biz), lakini OpEx ni zile ndururu unatoa daily kulingana na unavyotumia (kama kulipa fare ya matatu).\n\nKwa cloud, unahepa mzigo wa kubuy ma-server ghali na unalipia tu compute power yenye unatumia via OpEx model.\n\nSwali la kujipima: Kulipia subscription ya Azure kila mwezi kulingana na usage ni CapEx ama OpEx?';
        } else {
          replyText =
            'Capital Expenditure (CapEx) is the upfront spending on physical hardware, while Operational Expenditure (OpEx) is spending on goods and services with ongoing pay-as-you-go costs.\n\nCloud computing shifts technology spending from upfront CapEx (buying racks and power supplies) to flexible OpEx (paying for compute hours on demand).\n\nQuick check: Does migrating from an on-premises datacenter to Azure primarily reduce CapEx or OpEx?';
        }
      } else if (q.includes('storage') || q.includes('blob') || q.includes('tier')) {
        if (lang === 'Kiswahili') {
          replyText =
            'Azure Blob Storage ina viwango vitatu vya kuhifadhi data: Hot (inayotumiwa mara kwa mara), Cool (inayotumiwa mara chache, angalau siku 30), na Archive (ya kuhifadhi muda mrefu, angalau siku 180).\n\nFikiria duka la rejareja: Hot ni bidhaa zilizopo kwenye kaunta ya mbele, Cool ni bidhaa zilizopo stoo ya nyuma, na Archive ni nyaraka za mwaka jana zilizofungiwa kwenye sefu.\n\nKwenye Azure, Archive tier inagharimu pesa kidogo sana kwa uhifadhi lakini inachukua masaa kadhaa kutoa data (rehydration).\n\nSwali la kujipima: Kiwango gani cha Blob Storage kina gharama ya chini zaidi ya kuhifadhi data kwa miaka mingi?';
        } else if (lang === 'Sheng') {
          replyText =
            'Azure Blob Storage iko na access tiers tatu: Hot, Cool, na Archive kulingana na vile unacheki data yako.\n\nFikiria chapaa: Hot ni pesa ya mfuko unachapa nayo miamala kila saa, Cool ni pesa ya KCB M-Pesa unavuta mara moja kwa mwezi, na Archive ni land title deed umelock kwa SACCO box miaka kumi.\n\nKwa Azure, Archive tier inasave coins mob lakini ikihitajika inabidi ungojee masaa kadhaa irehydrate.\n\nSwali la kujipima: Tier gani inafaa kwa medical records ambazo zinaangaliwa mara moja tu kwa mwaka?';
        } else {
          replyText =
            'Azure Blob Storage offers three access tiers: Hot (frequently accessed data), Cool (infrequently accessed for at least 30 days), and Archive (rarely accessed for at least 180 days).\n\nThink of inventory: Hot is cash in the register drawer, Cool is backup stock in the back room, and Archive is tax receipts locked in a warehouse safe.\n\nArchive tier provides the lowest storage costs per gigabyte but requires several hours of rehydration before data can be read.\n\nQuick check: Which access tier has the lowest storage cost but the highest retrieval latency?';
        }
      } else {
        if (lang === 'Kiswahili') {
          replyText =
            'Huu ni msingi muhimu wa mtihani wa Microsoft Azure Fundamentals (AZ-900).\n\nFikiria ushirikiano wa chama au SACCO: Azure Policy ni sheria ndogo za kaunti ambazo kila mwanachama lazima afuate, naye Azure RBAC ni uamuzi wa nani amepewa funguo za kufungua sefu ya pesa.\n\nKwenye Azure, tunatumia Resource Groups kupanga miradi, na Management Groups kusimamia kampuni yenye subscriptions nyingi.\n\nSwali la kujipima: Chini ya Azure Governance, ni huduma gani inazuia rasilimali zisifutwe kimakosa: Azure Policy au Resource Locks?';
        } else if (lang === 'Sheng') {
          replyText =
            'Hii risto ni ya nguvu sana kwenye mtihani wa AZ-900 Azure fundamentals.\n\nFikiria SACCO ya mtaa: Azure Policy ni zile sheria za county hall kila msee lazima afuate, lakini Azure RBAC ni kuchagua nani anashika funguo za safe ya ganji.\n\nKwa Azure, Resource Locks inazuia msee yeyote kufuta production database kimakosa hata akiwa admin.\n\nSwali la kujipima: Kuzuia mtu asifute subscription kimakosa, unatumia CanNotDelete lock ama ReadOnly lock?';
        } else {
          replyText =
            'This concept is a core pillar of the Microsoft Azure Fundamentals (AZ-900) curriculum.\n\nThink of a SACCO office: Azure Policy enforces the county by-laws that every branch must follow, while Azure RBAC determines which staff members hold keys to specific offices.\n\nIn Azure, Resource Locks prevent accidental deletion, while Azure Policy enforces compliance standards across subscriptions.\n\nQuick check: Which Azure feature prevents accidental deletion of mission-critical production databases?';
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

      if (!isSupabaseConfigured()) {
        saveLocalMessages(next);
      } else if (user?.id) {
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
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-6">
      {/* Header with Mode indicator & Clear option */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#007BA7] text-white shadow-cerulean">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#101213] dark:text-[#F8FAFC]">
                AfriCloud Prep Study Buddy
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  isGeminiConfigured()
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : isSupabaseConfigured()
                      ? 'border border-[#007BA7]/40 bg-[#007BA7]/10 text-[#007BA7]'
                      : 'border border-slate-700 bg-slate-800 text-slate-300'
                }`}
              >
                {isGeminiConfigured() ? 'AfriCloud AI Live' : isSupabaseConfigured() ? 'Cloud Sync' : 'Offline Ready'}
              </span>
            </div>
            <p className="text-xs text-[#5B666E] dark:text-slate-400">
              Kenyan analogies for AZ-900 with interactive practice checks
            </p>
          </div>
        </div>

        {/* Controls: Language selector & Clear chat */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212] p-1">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => {
                setLang(l);
                setMessages((prev) => {
                  if (prev.length === 1 && prev[0].id === 'init-1') {
                    return [GREETINGS[l] || GREETINGS.English];
                  }
                  return prev;
                });
              }}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                  lang === l
                    ? 'bg-[#007BA7] text-white shadow-cerulean'
                    : 'text-slate-400 hover:text-[#F8FAFC]'
                }`}
              >
                {langFlag[l]} {l}
              </button>
            ))}
          </div>

          <button
            onClick={clearChat}
            title="Reset conversation"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DDE3E8] bg-white text-slate-500 hover:text-[#FF007F] hover:border-[#FF007F]/40 dark:border-[#242424] dark:bg-[#121212] dark:text-slate-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bento-card flex h-[580px] flex-col overflow-hidden p-0 border-[#DDE3E8] bg-white dark:border-[#242424] dark:bg-[#121212]">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const isQuiz = m.role === 'quiz';

            if (isQuiz && m.question) {
              const q = m.question;
              const isAnswered = m.revealed;

              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[#007BA7]/30 bg-[#EEF7FC] p-4 text-[#101213] shadow-md dark:border-[#007BA7]/40 dark:bg-[#0a1218] dark:text-[#F8FAFC]"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDE3E8] dark:border-[#1f2d3a]">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#007BA7] text-white">
                        <Target className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#007BA7]">
                        Practice Check: {q.objective || q.topic_id || 'Azure Concept'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#5B666E] dark:text-slate-400">
                      Difficulty:{' '}
                      {q.difficulty === 1
                        ? 'Beginner'
                        : q.difficulty === 2
                          ? 'Intermediate'
                          : 'Advanced'}
                    </span>
                  </div>

                  <p className="mb-3 text-sm font-semibold leading-relaxed text-[#101213] dark:text-[#F8FAFC]">
                    {q.question}
                  </p>

                  <div className="space-y-2 mb-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = m.selectedOption === optIdx;
                      const isCorrect = optIdx === q.answerIndex;
                      let btnClass =
                        'border-[#242424] bg-[#121212] text-[#F8FAFC] hover:border-[#007BA7] hover:bg-[#181818]';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnClass =
                            'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnClass = 'border-[#FF007F] bg-[#FF007F]/15 text-rose-200 font-bold';
                        } else {
                          btnClass = 'border-[#DDE3E8] bg-slate-100 text-[#5B666E] opacity-60 dark:border-[#1f2428] dark:bg-[#0c1014] dark:text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerQuiz(m.id, q, optIdx)}
                          className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${btnClass}`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#DDE3E8] text-[#5B666E] dark:border-[#333] dark:text-slate-300 text-[10px] font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-normal">{opt}</span>
                          {isAnswered && isCorrect && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <XCircle className="h-4 w-4 shrink-0 text-[#FF007F]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-xl border border-[#DDE3E8] bg-white p-3 text-xs dark:border-[#1f2d3a] dark:bg-[#121820]"
                    >
                      <p className="font-semibold text-[#101213] dark:text-white mb-1">
                        {m.selectedOption === q.answerIndex
                          ? '🎉 Safi sana! Correct.'
                          : '💡 Why right, why wrong:'}
                      </p>
                      <p className="text-[#333] dark:text-slate-300 leading-relaxed mb-2">{q.explanation}</p>
                      {q.wrongExplanations &&
                        m.selectedOption !== q.answerIndex &&
                        q.wrongExplanations[m.selectedOption] && (
                          <p className="text-[#FF007F] text-[11px] mb-2 font-medium">
                            Option {String.fromCharCode(65 + m.selectedOption)}:{' '}
                            {q.wrongExplanations[m.selectedOption]}
                          </p>
                        )}
                      <div className="flex items-center justify-between pt-2 border-t border-[#DDE3E8] dark:border-[#223242]">
                        <span className="text-[11px] text-slate-400">
                          Recorded to your readiness score
                        </span>
                        <button
                          onClick={() => navigate('quiz')}
                          className="inline-flex items-center gap-1 font-bold text-[#007BA7] hover:underline"
                        >
                          Full Practice Quiz <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            }

            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#007BA7]/20 text-[#007BA7]">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#007BA7] text-white font-medium self-end'
                        : 'border border-[#DDE3E8] bg-[#F6F8FA] text-[#101213] dark:border-[#242424] dark:bg-[#181818] dark:text-[#F8FAFC] whitespace-pre-line'
                    }`}
                  >
                    {m.text}
                  </div>

                  {!isUser && m.id !== 'init-1' && (
                    <div className="flex items-center gap-2 pl-1">
                      <button
                        onClick={() => handleQuizMe(m)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#007BA7]/40 bg-[#007BA7]/10 px-2.5 py-1 text-xs font-semibold text-[#007BA7] hover:bg-[#007BA7] hover:text-white transition-all active:scale-95"
                      >
                        <Target className="h-3.5 w-3.5" />
                        Quiz me on this
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {typing && (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#007BA7]/20 text-[#007BA7]">
                <Bot className="h-4 w-4" />
              </span>
              <div className="rounded-2xl border border-[#DDE3E8] bg-[#F6F8FA] px-4 py-3 text-xs text-[#5B666E] dark:border-[#242424] dark:bg-[#181818] dark:text-slate-400">
                Your Study Buddy is preparing your Kenyan analogy in {lang}...
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-[#DDE3E8] bg-[#F0F4F8] dark:border-[#202020] dark:bg-[#0c0c0c] scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Topics:
          </span>
          {SUGGESTED_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => send(p.prompt)}
              className="shrink-0 rounded-lg border border-[#DDE3E8] bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-[#007BA7] hover:text-[#007BA7] dark:border-[#242424] dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#007BA7] dark:hover:text-white transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-[#DDE3E8] p-3.5 bg-white dark:border-[#242424] dark:bg-[#121212]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask your Study Buddy in ${lang} (e.g. "Availability zones ni nini?")`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 rounded-xl border border-[#DDE3E8] bg-[#F6F8FA] px-4 py-2.5 text-sm text-[#101213] outline-none transition-colors focus:border-[#007BA7] dark:border-[#242424] dark:bg-[#181818] dark:text-[#F8FAFC] dark:focus:bg-[#202020]"
            />
            <button
              type="submit"
              disabled={!draft.trim() || typing}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007BA7] hover:bg-[#005C8A] text-white shadow-cerulean transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
