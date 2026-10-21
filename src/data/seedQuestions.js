import questionsJson from '../../supabase/seed/questions.json';

export const seedQuestions = questionsJson.map((q) => ({
  id: q.id,
  domain_id: q.domain_id,
  topic_id: q.topic_id,
  objective: q.objective,
  question: q.question,
  options: q.options,
  answerIndex: q.correct_index,
  explanation: q.explanation,
  wrongExplanations: q.wrong_explanations,
  learnUrl: q.learn_url,
  difficulty: q.difficulty || 1,
}));

export const defaultFlashcards = seedQuestions.slice(0, 10).map((q) => ({
  id: `fc-${q.id}`,
  front: q.question,
  back: `${q.options[q.answerIndex]}\n\n💡 ${q.explanation}`,
  domain: q.domain_id === 1 ? 'Cloud Concepts' : q.domain_id === 2 ? 'Azure Architecture & Services' : 'Azure Management & Governance',
  box: 1,
  next_review: new Date().toISOString(),
}));
