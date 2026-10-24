// AfriCloud Prep Gemini AI Client
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
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

export function buildSystemPrompt(language = 'English', learnerContext = '') {
  const isEnglish = language === 'English';
  const isKiswahili = language === 'Kiswahili';

  let languageRules = '';
  if (isEnglish) {
    languageRules = `LANGUAGE RULES (ENGLISH MODE):
- Reply entirely in plain, natural English.
- Do NOT use any Swahili or Sheng words, greetings, or sign-offs under any circumstances (specifically never say or include: "Jambo", "Sasa", "Niaje", "Karibu", "Niambie", "Asante", "Pole", "Sawa", "Poa", or any other Swahili/Sheng terms).
- Kenyan analogies (M-Pesa agents, matatus, SACCOs, chamas, county by-laws) are conceptual examples, not language. Explain them purely in clear English.
- Do NOT use any emojis. Zero emojis.
- Greetings and small talk: Respond in exactly one or two short lines without unnecessary fluff.`;
  } else if (isKiswahili) {
    languageRules = `LANGUAGE RULES (KISWAHILI MODE):
- Jibu kwa lugha safi ya Kiswahili fasaha.
- Tumia mifano halisi ya Kenya (mawakala wa M-Pesa, matatu, SACCO, chamas).
- Weka majina ya huduma za Azure kwa Kiingereza.`;
  } else {
    languageRules = `LANGUAGE RULES (SHENG MODE):
- Bonga kwa Sheng ya mtaani, changanya Kiswahili na English vile techies wa Nairobi wanabonga.
- Tumia mifano ya mtaani (nganya, ma-agent wa M-Pesa, SACCO locks).
- Weka majina ya huduma za Azure kwa Kiingereza.`;
  }

  return `You are the AfriCloud Prep study buddy for the Microsoft Azure Fundamentals (AZ-900) exam.
Reply in ${language}.

${languageRules}

CORE RULES:
1. Answer in at most 120 words unless the user asks for more detail.
2. For greetings and small talk: reply in one or two short lines.
3. For Azure concepts: give a one-sentence plain definition, exactly ONE relatable Kenyan analogy (not several), and how it maps to Azure.
4. Conclude technical answers with exactly one quick-check question (${isEnglish ? 'Quick Check:' : 'Swali la kujipima:'}).
5. Never invent fictional Azure features. Reference Microsoft Learn if unsure.
6. Never reproduce actual confidential certification exam leaks.
${isEnglish ? '7. ABSOLUTELY NO EMOJIS in the response.' : ''}
${learnerContext ? `Learner context: ${learnerContext}` : ''}`;
}

export async function streamGeminiStudyBuddy({
  message,
  language = 'English',
  history = [],
  learnerContext = '',
  onChunk,
  signal,
}) {
  const apiKey = getApiKey();
  const model = (import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL || '').trim();

  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  const systemPrompt = buildSystemPrompt(language, learnerContext);
  const contents = [];

  // Send only the last 6 messages of history for smaller requests
  const recentHistory = (history || []).slice(-6);
  for (const item of recentHistory) {
    if (item.text && (item.role === 'user' || item.role === 'ai')) {
      contents.push({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }],
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 280,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunk) {
            fullText += chunk;
            if (onChunk) {
              onChunk(chunk);
            }
          }
        } catch {
          // ignore partial json
        }
      }
    }
  }

  if (buffer.startsWith('data: ')) {
    const jsonStr = buffer.slice(6).trim();
    if (jsonStr && jsonStr !== '[DONE]') {
      try {
        const parsed = JSON.parse(jsonStr);
        const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) {
          fullText += chunk;
          if (onChunk) {
            onChunk(chunk);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return fullText;
}

export async function askGeminiStudyBuddy({
  message,
  language = 'English',
  history = [],
  learnerContext = '',
}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const reply = await streamGeminiStudyBuddy({
      message,
      language,
      history,
      learnerContext,
      signal: controller.signal,
    });
    return reply;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Gemini API request timed out after 20 seconds');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
