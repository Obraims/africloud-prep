// Pure calculateReadiness function
// Exact rule:
// 1. Min 30 questions answered total
// 2. Over last 50 answered questions: overall accuracy >= 80%
// 3. Every domain >= 70% with at least 8 answers floor
// 4. Otherwise shows 'Not enough data in <domain>' and exact gap message (e.g. 'Raise Governance by 9% to unlock')
export function calculateReadiness(attempts = [], domains = []) {
  const totalAnswered = attempts.length;

  const sortedAttempts = [...attempts].sort(
    (a, b) =>
      new Date(a.created_at || a.timestamp || 0) - new Date(b.created_at || b.timestamp || 0)
  );

  const windowAttempts = sortedAttempts.slice(-50);
  const windowAnswered = windowAttempts.length;

  const overallCorrect = windowAttempts.filter((a) => a.is_correct).length;
  const overallAccuracy =
    windowAnswered > 0 ? Math.round((overallCorrect / windowAnswered) * 100) : 0;

  const defaultDomains = [
    { id: 1, name: 'Cloud Concepts', code: 'concepts', weight: '25-30%' },
    { id: 2, name: 'Azure Architecture & Services', code: 'architecture', weight: '35-40%' },
    { id: 3, name: 'Azure Management & Governance', code: 'governance', weight: '30-35%' },
  ];

  const domainList = domains.length > 0 ? domains : defaultDomains;
  const domainReadiness = {};
  let allDomainsHaveMinData = true;
  let allDomainsMeetThreshold = true;
  let maxDomainGap = 0;
  let worstDomainName = '';
  let domainNeedingDataName = '';
  let domainNeedingDataRemaining = 0;

  for (const domain of domainList) {
    const dId = domain.id;
    const dCode = domain.code;
    const dAttempts = windowAttempts.filter(
      (a) => a.domain_id === dId || a.domain === domain.name || a.domain_code === dCode
    );

    const count = dAttempts.length;
    const correct = dAttempts.filter((a) => a.is_correct).length;
    let shortName = domain.name.replace('Describe ', '').replace('Azure ', '');
    if (shortName.includes('Management')) shortName = 'Governance';

    if (count < 8) {
      allDomainsHaveMinData = false;
      allDomainsMeetThreshold = false;
      if (!domainNeedingDataName) {
        domainNeedingDataName = shortName;
        domainNeedingDataRemaining = 8 - count;
      }

      domainReadiness[dId] = {
        domain_id: dId,
        name: domain.name,
        code: dCode,
        weight: domain.weight,
        answered: count,
        correct,
        accuracy: null,
        is_ready: false,
        status_message: `Not enough data in ${shortName}`,
      };
    } else {
      const acc = Math.round((correct / count) * 100);
      const isReady = acc >= 70;
      const gap = acc < 70 ? 70 - acc : 0;

      if (!isReady) {
        allDomainsMeetThreshold = false;
        if (gap > maxDomainGap) {
          maxDomainGap = gap;
          worstDomainName = shortName;
        }
      }

      domainReadiness[dId] = {
        domain_id: dId,
        name: domain.name,
        code: dCode,
        weight: domain.weight,
        answered: count,
        correct,
        accuracy: acc,
        is_ready: isReady,
        gap_percentage: gap,
        status_message: `${acc}%`,
      };
    }
  }

  const hasMinQuestions = totalAnswered >= 30;
  const isExamReady =
    hasMinQuestions && allDomainsHaveMinData && overallAccuracy >= 80 && allDomainsMeetThreshold;

  let gapMessage = '';
  if (!hasMinQuestions) {
    gapMessage = `Answer ${30 - totalAnswered} more questions to evaluate readiness (${totalAnswered}/30)`;
  } else if (!allDomainsHaveMinData) {
    gapMessage = `Not enough data in ${domainNeedingDataName} (${domainNeedingDataRemaining} more answers needed)`;
  } else if (maxDomainGap > 0) {
    gapMessage = `Raise ${worstDomainName} by ${maxDomainGap}% to unlock`;
  } else if (overallAccuracy < 80) {
    gapMessage = `Raise overall accuracy by ${80 - overallAccuracy}% to unlock (currently ${overallAccuracy}%)`;
  } else {
    gapMessage = 'Exam-Ready! You have met all readiness criteria.';
  }

  return {
    is_exam_ready: isExamReady,
    readiness_score: overallAccuracy,
    total_answered: totalAnswered,
    window_answered: windowAnswered,
    overall_accuracy: overallAccuracy,
    domain_readiness: domainReadiness,
    gap_message: gapMessage,
  };
}
