const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openrouter/free";

function getKey(): string | null {
  return process.env.OPENROUTER_API_KEY || null;
}

async function callAI(prompt: string, system?: string): Promise<string | null> {
  const key = getKey();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) headers["Authorization"] = `Bearer ${key}`;

  try {
    const res = await fetch(OPENROUTER, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: MODEL,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function generateSummary(jobTitle: string, industry: string): Promise<string | null> {
  return callAI(
    `Write a professional summary for a ${jobTitle || "professional"} in the ${industry || "general"} industry. Keep it concise, 3-4 sentences.`,
    "You are a professional resume writer. Write clear, impactful summaries without fluff."
  );
}

export async function improveText(text: string): Promise<string | null> {
  return callAI(
    `Rewrite the following resume bullet point to be more professional and impactful. Keep it concise and use active language:\n\n${text}`,
    "You are a professional resume editor. Improve bullet points without adding false information."
  );
}

export async function analyzeATS(resumeText: string): Promise<{
  score: number;
  issues: string[];
  suggestions: string[];
} | null> {
  const raw = await callAI(
    `Analyze this resume for ATS (Applicant Tracking System) compatibility. Rate it 1-100. List 3-5 issues and 3-5 improvement suggestions.\n\nResume:\n${resumeText}`,
    "You are an ATS expert. Be specific and actionable."
  );
  if (!raw) return null;
  return parseATSResponse(raw);
}

function parseATSResponse(raw: string): {
  score: number;
  issues: string[];
  suggestions: string[];
} {
  const scoreMatch = raw.match(/(?:Score|Rating)[:\s]*(\d{1,3})/i);
  const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 70;

  const issuesMatch = raw.match(/(?:Issues?|Problems?|Weaknesses?)[:\s]*\n?([\s\S]*?)(?=(?:Suggestions?|Improvements?|Recommendations?)[:\s]*\n?|$)/i);
  const suggestionsMatch = raw.match(/(?:Suggestions?|Improvements?|Recommendations?)[:\s]*\n?([\s\S]*?)$/i);

  function extractLines(text: string): string[] {
    return text
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*(?:\d+[\.\)]\s*|[-\u2022\u2023\u2022]\s*)/, "").trim())
      .filter((line) => line.length > 5);
  }

  const issues = issuesMatch ? extractLines(issuesMatch[1]) : [];
  const suggestions = suggestionsMatch ? extractLines(suggestionsMatch[1]) : [];

  return { score, issues, suggestions };
}
