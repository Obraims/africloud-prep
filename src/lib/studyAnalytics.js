// Study Analytics Engine for AfriCloud Prep
// Real data calculations for streak, study time, topic mastery, and study plans

import { az900Topics } from '../data/az900Outline.js';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const STORAGE_SESSIONS_KEY = 'africloud_prep_study_sessions';
const STUDY_UPDATE_EVENT = 'africloud_study_update';

export function notifyStudyUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STUDY_UPDATE_EVENT));
  }
}

export function subscribeToStudyUpdates(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(STUDY_UPDATE_EVENT, callback);
  return () => window.removeEventListener(STUDY_UPDATE_EVENT, callback);
}

// Format Date to Local 'YYYY-MM-DD'
export function formatLocalDate(dateObj) {
  const d = new Date(dateObj);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 1. STREAK CALCULATION
// Rule: Consecutive local calendar days with at least one study action (quiz answer, flashcard review, completed plan item)
// Resets after a missed day. 0 if none.
export function calculateStreak(actions = [], referenceDate = new Date()) {
  if (!actions || actions.length === 0) return 0;

  const activeDaysSet = new Set();
  for (const a of actions) {
    const rawDate = a.created_at || a.timestamp || a.date || a.updated_at;
    if (rawDate) {
      activeDaysSet.add(formatLocalDate(rawDate));
    }
  }

  if (activeDaysSet.size === 0) return 0;

  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const todayStr = formatLocalDate(ref);

  const yesterday = new Date(ref);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  // If neither today nor yesterday has an action, streak is 0 (broken)
  let checkDate = new Date(ref);
  if (activeDaysSet.has(todayStr)) {
    // Current streak active including today
    checkDate = new Date(ref);
  } else if (activeDaysSet.has(yesterdayStr)) {
    // Yesterday had action, streak remains active pending today's study
    checkDate = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;
  while (true) {
    const dateStr = formatLocalDate(checkDate);
    if (activeDaysSet.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// 2. STUDY TIME AGGREGATION & CHART DATA
// Rule: Sum of real active time per day from quiz and flashcard sessions.
// "This week" = total for current week (Mon-Sun).
// Chart = per-day totals for last 7 days up to today. Empty or 0 for days with no study. No future day bars.
export function calculateStudyTime(sessions = [], referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  // Group durations by YYYY-MM-DD
  const secondsByDay = {};
  for (const s of sessions) {
    const rawDate = s.created_at || s.date || s.started_at || s.ended_at;
    if (rawDate) {
      const dayKey = formatLocalDate(rawDate);
      const secs = Number(s.duration_seconds) || (Number(s.minutes) * 60) || 0;
      secondsByDay[dayKey] = (secondsByDay[dayKey] || 0) + secs;
    }
  }

  // 7-day trailing window up to today (last 6 days + today)
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = [];
  let totalWeekSeconds = 0;

  // Find start of current week (Monday)
  const currentDayOfWeek = ref.getDay(); // 0 is Sun, 1 is Mon...
  const distanceToMonday = (currentDayOfWeek + 6) % 7;
  const mondayThisWeek = new Date(ref);
  mondayThisWeek.setDate(ref.getDate() - distanceToMonday);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(ref.getDate() - i);
    const dayKey = formatLocalDate(d);
    const daySecs = secondsByDay[dayKey] || 0;
    const dayMinutes = Math.round(daySecs / 60);

    chartData.push({
      day: daysShort[d.getDay()],
      date: dayKey,
      minutes: dayMinutes,
      rawSeconds: daySecs,
    });
  }

  // Calculate "This week" total (from Monday to today)
  for (const [dayKey, secs] of Object.entries(secondsByDay)) {
    const [y, m, dayNum] = dayKey.split('-').map(Number);
    const checkD = new Date(y, m - 1, dayNum);
    if (checkD >= mondayThisWeek && checkD <= ref) {
      totalWeekSeconds += secs;
    }
  }

  const weekHours = Math.floor(totalWeekSeconds / 3600);
  const weekMins = Math.round((totalWeekSeconds % 3600) / 60);
  const thisWeekDisplay = totalWeekSeconds > 0 ? `${weekHours}h ${weekMins}m` : '0h 0m';

  const hasAnyStudyTime = Object.keys(secondsByDay).length > 0;

  return {
    thisWeekDisplay,
    totalWeekSeconds,
    chartData,
    hasAnyStudyTime,
  };
}

// 3. TOPIC MASTERY CALCULATION
// Rule: At least 5 answered in that topic with 80% or more correct.
export const TOPIC_MASTERY_RULE_TEXT = 'Mastery Rule: At least 5 questions answered in this topic with 80%+ accuracy';

export function calculateTopicMastery(attempts = [], topicsList = az900Topics) {
  const topicStats = {};

  for (const a of attempts) {
    if (a.topic_id) {
      if (!topicStats[a.topic_id]) {
        topicStats[a.topic_id] = { total: 0, correct: 0 };
      }
      topicStats[a.topic_id].total++;
      if (a.is_correct) {
        topicStats[a.topic_id].correct++;
      }
    }
  }

  const topicsWithStatus = (topicsList || []).map((t) => {
    const stats = topicStats[t.id] || { total: 0, correct: 0 };
    const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    const isMastered = stats.total >= 5 && accuracy >= 80;

    return {
      ...t,
      answeredCount: stats.total,
      correctCount: stats.correct,
      accuracy: stats.total > 0 ? Math.round(accuracy) : null,
      isMastered,
    };
  });

  const masteredCount = topicsWithStatus.filter((t) => t.isMastered).length;
  const totalCount = topicsWithStatus.length;

  return {
    masteredCount,
    totalCount,
    topicsWithStatus,
    ruleText: TOPIC_MASTERY_RULE_TEXT,
  };
}

// 4. PERSONAL STUDY PLAN ITEMS EVALUATION
// Rule: Items linked to a measurable action complete automatically (diagnostic quiz finished,
// X questions answered in domain, flashcard box reviewed). Other items are ticked manually.
export const DEFAULT_PLAN_ITEMS = [
  {
    id: 'p1',
    title: 'Diagnostic Quiz across 3 domains',
    domain: 'Cloud Concepts',
    minutes: 15,
    type: 'auto',
    trigger: { action: 'diagnostic_quiz', minAnswers: 10 },
    done: false,
  },
  {
    id: 'p2',
    title: 'Review Availability Zones & Regions',
    domain: 'Azure Architecture',
    minutes: 20,
    type: 'auto',
    trigger: { action: 'domain_questions', domain_id: 2, minAnswers: 5 },
    done: false,
  },
  {
    id: 'p3',
    title: 'Study Resource Groups & Locks',
    domain: 'Azure Management',
    minutes: 15,
    type: 'manual',
    done: false,
  },
];

export function evaluateStudyPlan(items = DEFAULT_PLAN_ITEMS, context = {}) {
  const { attempts = [], flashcards = [] } = context;

  const totalAnswered = attempts.length;
  const hasReviewedFlashcards = flashcards.some((c) => c.box > 1 || (c.updated_at && c.updated_at !== c.created_at));

  return items.map((item) => {
    if (item.type === 'auto') {
      let autoDone = false;
      if (item.trigger?.action === 'diagnostic_quiz') {
        autoDone = totalAnswered >= (item.trigger.minAnswers || 10);
      } else if (item.trigger?.action === 'domain_questions') {
        const dId = item.trigger.domain_id;
        const count = attempts.filter((a) => a.domain_id === dId).length;
        autoDone = count >= (item.trigger.minAnswers || 5);
      } else if (item.trigger?.action === 'flashcard_review') {
        autoDone = hasReviewedFlashcards;
      }
      return {
        ...item,
        done: autoDone || Boolean(item.done),
      };
    }
    return item;
  });
}

// 5. SESSION LOGGING & PERSISTENCE
export async function logStudySession({ userId, mode = 'quiz', durationSeconds = 60, details = {} }) {
  if (durationSeconds <= 0) return;

  const newSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    user_id: userId || 'demo-user',
    mode,
    duration_seconds: Math.round(durationSeconds),
    date: formatLocalDate(new Date()),
    created_at: new Date().toISOString(),
    ...details,
  };

  // 1. Local Storage persistence
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_SESSIONS_KEY) || '[]');
    existing.unshift(newSession);
    localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn('Study session local log notice:', err);
  }

  // 2. Supabase persistence in study_plans if logged in
  if (userId && isSupabaseConfigured()) {
    try {
      const { data: currentPlan } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const existingSessions = currentPlan?.warnings || [];
      const updatedSessions = [newSession, ...existingSessions].slice(0, 50);

      if (currentPlan?.id) {
        await supabase
          .from('study_plans')
          .update({ warnings: updatedSessions })
          .eq('id', currentPlan.id);
      } else {
        await supabase.from('study_plans').insert([
          {
            user_id: userId,
            exam_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
            days: [{ tasks: [] }],
            warnings: updatedSessions,
          },
        ]);
      }
    } catch (dbErr) {
      console.warn('Study session Supabase sync notice:', dbErr);
    }
  }

  notifyStudyUpdate();
}

export function getLocalStudySessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_SESSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}
