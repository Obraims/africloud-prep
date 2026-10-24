// Supabase Edge Function: buddy-chat (Plain JavaScript)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Client configuration outside request handler for fast warm starts
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-3.1-flash-lite';
const rateLimits = new Map();
const MAX_REQUESTS_PER_MINUTE = 30;

const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.enum(['English', 'Kiswahili', 'Sheng']).default('English'),
  learner_context: z.string().optional(),
  stream: z.boolean().optional().default(false),
  history: z.array(z.object({
    role: z.string(),
    text: z.string(),
  })).optional().default([]),
});

function buildEdgeSystemPrompt(language, learnerContext) {
  const isEnglish = language === 'English';
  const isKiswahili = language === 'Kiswahili';

  let languageRules = '';
  if (isEnglish) {
    languageRules = `LANGUAGE RULES (ENGLISH MODE):
- Reply entirely in plain, natural English.
- Do NOT use any Swahili or Sheng words, greetings, or sign-offs (e.g. avoid "Jambo", "Sasa", "Niaje", "Karibu", "Niambie", "Asante", "Pole", "Sawa", "Poa").
- Kenyan analogies (M-Pesa agents, matatus, SACCOs, chamas, county by-laws) are conceptual examples, not language. Explain them purely in clear English.
- Do NOT use any emojis. Zero emojis.
- Greetings and small talk: reply in exactly one or two short lines.`;
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
6. Never reproduce actual exam questions.
${isEnglish ? '7. ABSOLUTELY NO EMOJIS in the response.' : ''}
${learnerContext ? `Learner context: ${learnerContext}` : ''}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  let userId = 'anonymous';

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub || 'user';
    } catch {
      userId = 'authenticated-user';
    }

    // Rate Limiting
    const now = Date.now();
    const userTimes = rateLimits.get(userId) || [];
    const recentTimes = userTimes.filter((t) => now - t < 60000);
    if (recentTimes.length >= MAX_REQUESTS_PER_MINUTE) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    recentTimes.push(now);
    rateLimits.set(userId, recentTimes);

    const body = await req.json();
    const validated = requestSchema.parse(body);

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured on the server');
    }

    const systemPrompt = buildEdgeSystemPrompt(validated.language, validated.learner_context);
    const contents = [];

    // Send only the last 6 messages of history
    const recentHistory = (validated.history || []).slice(-6);
    for (const h of recentHistory) {
      if (h.text && (h.role === 'user' || h.role === 'ai')) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({ role: 'user', parts: [{ text: validated.message }] });

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

    if (validated.stream) {
      const streamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
      const geminiRes = await fetch(streamUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        throw new Error(`Gemini API error: ${geminiRes.status} ${errText}`);
      }

      return new Response(geminiRes.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    console.log(
      JSON.stringify({
        function: 'buddy-chat',
        userId,
        language: validated.language,
        durationMs: Date.now() - startTime,
        status: 'success',
      })
    );

    return new Response(JSON.stringify({ reply: replyText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        function: 'buddy-chat',
        userId,
        error: err.message,
        status: 'error',
      })
    );

    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
