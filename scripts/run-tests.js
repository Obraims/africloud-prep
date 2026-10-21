import { calculateReadiness } from '../src/lib/readiness.js';
import { advanceCard, isCardDue } from '../src/lib/leitner.js';

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

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
