// Supabase Edge Function: generate-questions (Plain JavaScript)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const inputSchema = z.object({
  topic_id: z.string(),
  objective: z.string(),
  count: z.number().int().min(1).max(5).default(3),
  difficulty: z.number().int().min(1).max(3).default(2),
  language: z.string().default("English"),
  avoid_questions: z.array(z.string()).optional(),
});

const questionItemSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correct_index: z.number().int().min(0).max(3),
  explanation: z.string(),
  wrong_explanations: z.array(z.string().nullable()).length(4),
  difficulty: z.number(),
  confidence: z.enum(["high", "medium", "low"]),
});

const questionsOutputSchema = z.array(questionItemSchema);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const input = inputSchema.parse(body);

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";

    const promptText = `You write practice questions for Microsoft Azure Fundamentals (AZ-900). Output JSON array only.
Input: ${JSON.stringify(input)}
Rules:
- Exactly ${input.count} questions.
- Stay inside objective: "${input.objective}".
- Fresh scenarios (incorporate East African contexts where natural).
- Exactly four options, one correct. wrong_explanations has null at correct_index and one-line reasons for wrong ones.
- Only output confidence="high" if completely accurate.
Output Schema: [ { "question": string, "options": [string, string, string, string], "correct_index": number, "explanation": string, "wrong_explanations": [string|null, string|null, string|null, string|null], "difficulty": number, "confidence": "high"|"medium"|"low" } ]`;

    const callGemini = async (extra = "") => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: promptText + extra }] }],
            generationConfig: {
              temperature: 0.5,
              responseMimeType: "application/json",
            },
          }),
        }
      );
      const data = await res.json();
      return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text);
    };

    let items;
    try {
      const raw = await callGemini();
      items = questionsOutputSchema.parse(raw);
    } catch {
      const raw = await callGemini("\nFAILED TO PARSE. RETURN VALID JSON ARRAY MATCHING SCHEMA EXACTLY.");
      items = questionsOutputSchema.parse(raw);
    }

    const highConfidenceItems = items.filter((q) => q.confidence === "high").map((q) => ({
      ...q,
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      reviewed: false,
      source: "ai",
      domain_id: input.topic_id.startsWith("cc") ? 1 : input.topic_id.startsWith("mg") ? 3 : 2,
      topic_id: input.topic_id,
      objective: input.objective,
      learn_url: `https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(input.objective)}`,
    }));

    return new Response(JSON.stringify(highConfidenceItems), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Failed to generate questions" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
