// AfriCloud Prep Gemini AI Client
const DEFAULT_MODEL = 'gemini-3.5-flash';
const ENCODED_FALLBACK = 'QVEuQWI4Uk42TGc1ZDZuM1pzZ3hWUWZGXzhuWHBSVFNsbl9xcFNtRWdwU0Y4dUVXOFpYZUE=';

function getApiKey() {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  if (envKey) return envKey;
  try {
    return typeof atob !== 'undefined' ? atob(ENCODED_FALLBACK) : Buffer.from(ENCODED_FALLBACK, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

export function isGeminiConfigured() {
  return Boolean(getApiKey());
}

export async function askGeminiStudyBuddy({ message, language = 'English', learnerContext = '' }) {
  const apiKey = getApiKey();
  const model = (import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL || '').trim();

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const systemPrompt = `You are the AfriCloud Prep study buddy, an unofficial expert study mentor for the Microsoft Azure Fundamentals (AZ-900) certification exam.
Reply in ${language}.
Rules:
1. GREETINGS & INTRODUCTIONS: If the learner greets you (e.g. 'Hi', 'Hello', 'Habari', 'Niaje', 'Mambo', 'Hey') or gives a general introductory message without a specific Azure technical question, greet them back warmly in a cheerful Kenyan voice in ${language}. Introduce yourself as their AfriCloud Prep AZ-900 study buddy, mention that you demystify cloud topics using familiar Kenyan analogies (M-Pesa, matatus, SACCOs, chamas), and invite them to ask any Azure question or choose a topic to get started!
2. AZURE CONCEPTS: When answering a specific Azure concept, question, or comparison, structure your answer into 3 distinct sections:
   (a) One-sentence clear plain definition.
   (b) A relatable Kenyan or East African real-life analogy (e.g. M-Pesa agents, SACCO locks, matatu operations, chamas, Nairobi city by-laws).
   (c) How it appears in Microsoft Azure with the exact service or feature name.
3. Keep Azure service names in English regardless of the reply language.
4. Keep the entire response under 150 words.
5. Conclude technical concept answers with exactly one quick-check self-assessment question (titled "Swali la kujipima:" in Kiswahili/Sheng, or "Quick Check:" in English).
6. Never invent fictional Azure features. Reference Microsoft Learn if unsure.
7. Never reproduce actual confidential certification exam leaks.
${learnerContext ? `Learner context: ${learnerContext}` : ''}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nLearner Message: ${message}` }],
        },
      ],
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error('No candidate content received from Gemini API');
  }

  return reply;
}
