// Supabase Edge Function: generate-plan (Plain JavaScript)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const inputSchema = z.object({
  today: z.string(),
  exam_date: z.string(),
  hours_per_day: z.number().positive().max(12),
  domain_weights: z.record(z.number()),
  topic_scores: z.array(z.any()),
  valid_topic_ids: z.array(z.string()),
  cards_due_today: z.number().nonnegative(),
});

const planOutputSchema = z.object({
  summary: z.string().max(300),
  days: z.array(
    z.object({
      date: z.string(),
      tasks: z.array(
        z.object({
          topic_id: z.string().nullable(),
          type: z.enum(['read', 'quiz', 'flashcards', 'mock', 'rest']),
          minutes: z.number().positive(),
          rationale: z.string(),
        })
      ),
    })
  ),
  warnings: z.array(z.string()),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const input = inputSchema.parse(body);

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const geminiModel = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash';

    const promptText = `You are the planning engine of AfriCloud Prep. Output JSON only.
Input: ${JSON.stringify(input)}
Rules:
- Sum of minutes per day must not exceed hours_per_day * 60 (${input.hours_per_day * 60}m).
- Use only topic_ids from valid_topic_ids.
- Prioritize weakest topics and official domain weights.
- Include flashcards task on study days. Include timed mock 2-3 days before exam if timeline allows.
Output Schema: { "summary": string, "days": [{ "date": string, "tasks": [{ "topic_id": string|null, "type": "read"|"quiz"|"flashcards"|"mock"|"rest", "minutes": number, "rationale": string }] }], "warnings": string[] }`;

    const callGemini = async (extra = '') => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: promptText + extra }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        }
      );
      const data = await res.json();
      const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(rawJson);
    };

    let parsedPlan;
    try {
      const raw = await callGemini();
      parsedPlan = planOutputSchema.parse(raw);
    } catch {
      const raw = await callGemini(
        '\nPREVIOUS ATTEMPT RETURNED INVALID JSON OR SCHEMA. FIX AND RETURN VALID JSON ONLY.'
      );
      parsedPlan = planOutputSchema.parse(raw);
    }

    return new Response(JSON.stringify(parsedPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Failed to generate plan' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
