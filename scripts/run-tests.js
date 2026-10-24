import { calculateReadiness } from '../src/lib/readiness.js';
import { advanceCard, isCardDue } from '../src/lib/leitner.js';
import {
  calculateStreak,
  calculateStudyTime,
  calculateTopicMastery,
  evaluateStudyPlan,
  formatLocalDate,
} from '../src/lib/studyAnalytics.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`✓ ${message}`);
  } else {
    failed++;
    console.error(`✗ ${message}`);
  }
}

console.log('\n--- Running AfriCloud Prep Unit Tests (Plain JS) ---');

// 1. Readiness tests
const mockDomains = [
  { id: 1, name: 'Cloud Concepts', code: 'concepts', weight: '25-30%' },
  { id: 2, name: 'Azure Architecture & Services', code: 'architecture', weight: '35-40%' },
  { id: 3, name: 'Azure Management & Governance', code: 'governance', weight: '30-35%' },
];

const attemptsUnder30 = Array(25)
  .fill(0)
  .map((_, i) => ({ domain_id: (i % 3) + 1, is_correct: true }));
const resUnder30 = calculateReadiness(attemptsUnder30, mockDomains);
assert(resUnder30.is_exam_ready === false, 'Blocks exam-ready when total answered < 30');
assert(
  resUnder30.gap_message.includes('Answer 5 more questions'),
  'Reports remaining questions to reach 30'
);

// Floor test: < 8 answers in domain 3
const attemptsNeedingData = [
  ...Array(15)
    .fill(0)
    .map(() => ({ domain_id: 1, is_correct: true })),
  ...Array(15)
    .fill(0)
    .map(() => ({ domain_id: 2, is_correct: true })),
  ...Array(5)
    .fill(0)
    .map(() => ({ domain_id: 3, is_correct: true })),
];
const resNeedingData = calculateReadiness(attemptsNeedingData, mockDomains);
assert(
  resNeedingData.is_exam_ready === false,
  'Blocks exam-ready when domain has < 8 answers in window'
);
assert(
  resNeedingData.domain_readiness[3].accuracy === null,
  'Sets accuracy to null when domain < 8 answers'
);
assert(
  resNeedingData.gap_message.includes('Not enough data in Governance'),
  'Shows "Not enough data" gap message'
);

// Exact gap test: 61% accuracy in domain 3 -> gap is 9% -> "Raise Governance by 9% to unlock"
const attemptsAminaState = [
  ...Array(15)
    .fill(0)
    .map(() => ({ domain_id: 1, is_correct: true })), // 100%
  ...Array(15)
    .fill(0)
    .map((_, i) => ({ domain_id: 2, is_correct: i < 13 })), // 87%
  ...Array(18)
    .fill(0)
    .map((_, i) => ({ domain_id: 3, is_correct: i < 11 })), // 11/18 = 61%
];
const resAmina = calculateReadiness(attemptsAminaState, mockDomains);
assert(resAmina.is_exam_ready === false, 'Blocks exam-ready when domain < 70%');
assert(resAmina.domain_readiness[3].gap_percentage === 9, 'Calculates exact 9% gap for Governance');
assert(
  resAmina.gap_message === 'Raise Governance by 9% to unlock',
  'Outputs exact gap message "Raise Governance by 9% to unlock"'
);

// Ready test
const attemptsReady = [
  ...Array(15)
    .fill(0)
    .map(() => ({ domain_id: 1, is_correct: true })),
  ...Array(15)
    .fill(0)
    .map(() => ({ domain_id: 2, is_correct: true })),
  ...Array(15)
    .fill(0)
    .map(() => ({ domain_id: 3, is_correct: true })),
];
const resReady = calculateReadiness(attemptsReady, mockDomains);
assert(resReady.is_exam_ready === true, 'Unlocks exam-ready when all thresholds met');

// 2. Leitner tests
const baseDate = new Date('2026-10-21T12:00:00Z');
const card = { id: 'c1', front: 'Q', back: 'A', box: 1, next_review: baseDate.toISOString() };

const cardAdvanced = advanceCard(card, true, baseDate);
assert(cardAdvanced.box === 2, 'Advances card from Box 1 to Box 2 on success');

const cardFailed = advanceCard({ ...card, box: 4 }, false, baseDate);
assert(cardFailed.box === 1, 'Resets card from Box 4 to Box 1 on failure');

// 3. Streak calculation unit tests
const testToday = new Date('2026-10-25T10:00:00Z');
const emptyStreak = calculateStreak([], testToday);
assert(emptyStreak === 0, 'Streak is 0 for new account with no study actions');

const missedDayActions = [
  { created_at: '2026-10-20T10:00:00Z' },
  { created_at: '2026-10-21T10:00:00Z' },
];
assert(calculateStreak(missedDayActions, testToday) === 0, 'Streak resets to 0 after missed days');

const consecutiveActions = [
  { created_at: '2026-10-23T10:00:00Z' },
  { created_at: '2026-10-24T10:00:00Z' },
  { created_at: '2026-10-25T08:00:00Z' },
];
assert(calculateStreak(consecutiveActions, testToday) === 3, 'Calculates exact 3-day consecutive streak');

const yesterdayOnly = [
  { created_at: '2026-10-24T10:00:00Z' },
];
assert(calculateStreak(yesterdayOnly, testToday) === 1, 'Maintains 1-day active streak from yesterday before today study');

// 4. Study-time aggregation & 7-day chart tests
const emptyStudyTime = calculateStudyTime([], testToday);
assert(emptyStudyTime.thisWeekDisplay === '0h 0m', 'Empty account shows 0h 0m study time');
assert(emptyStudyTime.chartData.length === 7, 'Weekly chart has exactly 7 days');
assert(emptyStudyTime.chartData.every((d) => d.minutes === 0), 'Empty account chart has all zero minutes');
assert(emptyStudyTime.chartData[6].date === formatLocalDate(testToday), 'Chart ends on current date (no future bars)');

const realSessions = [
  { created_at: '2026-10-24T10:00:00Z', duration_seconds: 1800 }, // 30 mins
  { created_at: '2026-10-25T09:00:00Z', duration_seconds: 2700 }, // 45 mins
];
const aggregatedTime = calculateStudyTime(realSessions, testToday);
assert(aggregatedTime.thisWeekDisplay === '1h 15m', 'Correctly aggregates 1h 15m study time for current week');
assert(aggregatedTime.chartData[6].minutes === 45, 'Accurately displays 45 minutes on today bar');
assert(aggregatedTime.chartData[5].minutes === 30, 'Accurately displays 30 minutes on yesterday bar');

// 5. Topic mastery tests (Rule: >= 5 answered in topic with >= 80% accuracy)
const sampleTopics = [
  { id: 't1', name: 'Cloud Benefits' },
  { id: 't2', name: 'Availability Zones' },
];
const masteryAttempts = [
  { topic_id: 't1', is_correct: true },
  { topic_id: 't1', is_correct: true },
  { topic_id: 't1', is_correct: true },
  { topic_id: 't1', is_correct: true },
  { topic_id: 't1', is_correct: true },
  { topic_id: 't2', is_correct: true },
  { topic_id: 't2', is_correct: true },
  { topic_id: 't2', is_correct: true },
];
const topicMasteryRes = calculateTopicMastery(masteryAttempts, sampleTopics);
assert(topicMasteryRes.masteredCount === 1, 'Counts exactly 1 topic mastered');
assert(topicMasteryRes.topicsWithStatus[0].isMastered === true, 'Topic 1 is mastered with 5/5');
assert(topicMasteryRes.topicsWithStatus[1].isMastered === false, 'Topic 2 is not mastered with only 3 answers (< 5 threshold)');

// 6. Study plan auto-ticking evaluation tests
const planTestItems = [
  { id: 'p1', title: 'Diagnostic', type: 'auto', trigger: { action: 'diagnostic_quiz', minAnswers: 10 }, done: false },
  { id: 'p2', title: 'Manual Review', type: 'manual', done: false },
];
const planEvaluatedEmpty = evaluateStudyPlan(planTestItems, { attempts: [] });
assert(planEvaluatedEmpty[0].done === false, 'Diagnostic quiz plan item is undone when attempts < 10');

const planEvaluatedFull = evaluateStudyPlan(planTestItems, { attempts: Array(10).fill({ is_correct: true }) });
assert(planEvaluatedFull[0].done === true, 'Diagnostic quiz plan item automatically completes when attempts >= 10');
assert(planEvaluatedFull[1].done === false, 'Manual plan item remains false until user ticks');

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
