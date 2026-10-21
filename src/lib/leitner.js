export const LEITNER_INTERVALS_DAYS = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

export function getNextReviewDate(box, fromDate = new Date()) {
  const days = LEITNER_INTERVALS_DAYS[box] || 1;
  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function isCardDue(card, asOfDate = new Date()) {
  if (!card.next_review) return true;
  return new Date(card.next_review).getTime() <= asOfDate.getTime();
}

export function advanceCard(card, correct, reviewDate = new Date()) {
  const currentBox = card.box || 1;
  const newBox = correct ? Math.min(5, currentBox + 1) : 1;
  const nextReview = getNextReviewDate(newBox, reviewDate);

  return {
    ...card,
    box: newBox,
    next_review: nextReview.toISOString(),
    last_reviewed: reviewDate.toISOString(),
  };
}
