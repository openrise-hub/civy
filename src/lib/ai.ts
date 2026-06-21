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

export async function suggestSkills(jobTitle: string, industry: string): Promise<string[] | null> {
  const raw = await callAI(
    `List 10 relevant skills for a ${jobTitle || "professional"} in the ${industry || "general"} industry. Respond with a comma-separated list only, no numbering.`,
    "You are a career coach. Suggest real, relevant skills."
  );
  if (!raw) return null;
  return raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10);
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
  return {
    score: 70,
    issues: [raw],
    suggestions: [raw],
  };
}
