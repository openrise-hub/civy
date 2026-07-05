import { LOCALE_LABELS } from "@/lib/locales";

const OPENROUTER = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openrouter/free";

function getKey(): string | null {
  return process.env.OPENROUTER_API_KEY || null;
}

async function callAI(prompt: string, system?: string, maxTokens = 500): Promise<string | null> {
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
        max_tokens: maxTokens,
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function improveText(text: string, locale = "en", jobTitle?: string): Promise<string | null> {
  const lang = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || "English";
  const context = jobTitle ? ` for a ${jobTitle} role` : "";
  return callAI(
    `Rewrite this resume bullet point${context}. Use active language and an action verb. If the original includes numbers or metrics, preserve them. If not, do not invent them. Return ONLY the rewritten bullet point — no explanations, no alternatives, no markdown.\n\nOriginal:\n${text}\n\nRespond in ${lang}.`,
    "You are a professional resume editor. Improve bullet points without adding false information. NEVER fabricate, exaggerate, or add skills, metrics, or experiences not explicitly mentioned in the original text. Everything must be interview-safe."
  );
}

export interface ATSOutput {
  score: number;
  rewrittenResume: string;
  topIssues: string[];
  keywordGaps: string[];
  matchVerdict?: string;
}

const ATS_SYSTEM_PROMPT = `You are an expert resume writer with 20+ years of experience helping professionals get shortlisted at top companies. Respond with valid JSON only — no markdown, no code fences, no explanation.`;

function buildATSPromptWithoutJD(resumeText: string): string {
  return `Rewrite this resume for maximum ATS compatibility (target 85+/100). Improve action verbs, phrasing, and keyword optimization. Score it 1-100 based on keyword alignment, structure, and impact. Identify the top 3-5 specific fixes needed. NEVER fabricate, exaggerate, or add skills, metrics, or experiences not explicitly mentioned. Keep everything interview-safe — every line must be defensible. Return this JSON:
{
  "score": 80,
  "rewrittenResume": "FULL rewritten resume text with improved phrasing. Preserve ALL factual information exactly.",
  "topIssues": ["Specific fix 1", "Specific fix 2"],
  "keywordGaps": []
}

Resume:\n${resumeText}`;
}

function buildATSPromptWithJD(resumeText: string, jobDescription: string): string {
  return `Compare this resume against the provided Job Description. If the match is poor due to missing core skills or domain mismatch, set matchVerdict to an honest explanation and score accordingly. Add role-specific keyword gaps. Rewrite the resume to better align with the JD while preserving ALL factual information exactly. Score it 1-100. NEVER fabricate, exaggerate, or add skills, metrics, or experiences not explicitly mentioned. Keep everything interview-safe. Return this JSON:
{
  "score": 80,
  "matchVerdict": "Strong match for this role",
  "rewrittenResume": "FULL rewritten resume text aligned with the JD.",
  "topIssues": ["Specific fix 1", "Specific fix 2"],
  "keywordGaps": ["MissingKeyword1", "MissingKeyword2"]
}

Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`;
}

export async function analyzeATS(resumeText: string, jobDescription = "", locale = "en"): Promise<ATSOutput | null> {
  const lang = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || "English";
  const prompt = jobDescription
    ? buildATSPromptWithJD(resumeText, jobDescription)
    : buildATSPromptWithoutJD(resumeText);
  const raw = await callAI(`${prompt}\n\nRespond in ${lang}.`, ATS_SYSTEM_PROMPT, 1500);
  if (!raw) return null;
  return parseJSON(raw) as ATSOutput | null;
}

export interface ResumeInput {
  fullName: string;
  jobTitle: string;
  industry: string;
  experience: Array<{
    company: string;
    title: string;
    startYear: string;
    endYear: string;
    description: string;
  }>;
  noExperience: boolean;
  projectDescription: string;
  education: Array<{
    degree: string;
    field: string;
    institution: string;
    year: string;
  }>;
  keySkills: string;
}

export interface ResumeOutput {
  summary: string;
  experience: Array<{
    company: string;
    title: string;
    dateRange: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
}

const RESUME_SYSTEM_PROMPT = `You are a professional resume writer. Your job is to polish the candidate's real background into professional, impactful resume content. Respond with valid JSON only — no markdown, no code fences, no explanation. Follow this structure:
{
  "summary": "A professional 3-4 sentence summary synthesizing the candidate's real background.",
  "experience": [
    { "company": "...", "title": "...", "dateRange": "...", "description": "..." }
  ],
  "education": [
    { "degree": "...", "institution": "...", "year": "..." }
  ],
  "skills": ["8-12 skills"],
  "projects": [
    { "name": "...", "description": "..." }
  ]
}
If the candidate has experience entries: polish their descriptions into 2-4 action-oriented bullet points. Keep ALL company names, titles, and dates EXACTLY as provided.
If the candidate has NO experience: omit the experience array entirely. Instead, generate a projects array from their project description.
If the candidate is a new graduate: emphasize education and coursework in the summary.
If the candidate is a career changer: emphasize transferable skills and projects in the summary.
Always use exact names, titles, dates, institutions, and degrees as provided. Never invent. Polish language and structure only.`;

function buildResumePrompt(input: ResumeInput, lang: string): string {
  const lines: string[] = [];
  lines.push(`Polish this resume for a ${input.jobTitle || "professional"} targeting the ${input.industry || "general"} industry.`);
  lines.push("");
  lines.push(`Full Name: ${input.fullName}`);
  lines.push(`Job Title: ${input.jobTitle}`);
  lines.push(`Industry: ${input.industry}`);
  lines.push("");

  if (!input.noExperience && input.experience.length > 0) {
    lines.push("--- Work Experience (preserve companies, titles, and dates exactly) ---");
    for (const exp of input.experience) {
      const dateRange = `${exp.startYear} - ${exp.endYear || "Present"}`;
      lines.push(`Company: ${exp.company} | Role: ${exp.title} | Dates: ${dateRange}`);
      lines.push(`What I did: ${exp.description}`);
      lines.push("---");
    }
  } else {
    lines.push("--- No Professional Experience ---");
    lines.push(`Project & Background Description: ${input.projectDescription}`);
  }

  lines.push("");
  if (input.education.length > 0) {
    lines.push("--- Education (preserve institutions and degrees exactly) ---");
    for (const edu of input.education) {
      lines.push(`Degree: ${edu.degree} | Field: ${edu.field} | Institution: ${edu.institution} | Year: ${edu.year}`);
    }
  }

  lines.push("");
  lines.push(`--- Skills ---`);
  lines.push(input.keySkills || "Not provided");

  lines.push("");
  lines.push(`Respond in ${lang}.`);

  return lines.join("\n");
}

function parseJSON(raw: string): ResumeOutput | null {
  let json = raw.trim();
  const fenceMatch = json.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) json = fenceMatch[1].trim();
  try {
    return JSON.parse(json) as ResumeOutput;
  } catch {
    return null;
  }
}

async function callAIWithRetry(prompt: string, system: string, retries = 3): Promise<string | null> {
  for (let i = 0; i < retries; i++) {
    const result = await callAI(prompt, system, 1500);
    if (result) return result;
    if (i < retries - 1) await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

export async function generateResume(input: ResumeInput, locale = "en"): Promise<ResumeOutput | null> {
  const lang = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || "English";
  const prompt = buildResumePrompt(input, lang);
  const raw = await callAIWithRetry(prompt, RESUME_SYSTEM_PROMPT, 3);
  if (!raw) return null;
  return parseJSON(raw);
}

const IMPROVE_SECTION_SYSTEM = "You are a professional resume editor with 20+ years of experience helping professionals get shortlisted at top companies. You rewrite resume sections to be cohesive, varied, and ATS-friendly. Respond with valid JSON only — no markdown, no code fences, no explanation. Use this exact structure: {\"items\": [\"Rewritten item 1\", \"Rewritten item 2\", \"...\"]}";

export async function improveSection(
  sectionItems: string[],
  sectionType: string,
  locale = "en",
  jobTitle?: string,
  industry?: string,
): Promise<string[] | null> {
  const lang = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || "English";
  const roleContext = jobTitle ? ` for a ${jobTitle} role` : "";
  const industryContext = industry ? ` targeting the ${industry} industry` : "";
  const itemsList = sectionItems.map((item, i) => `${i + 1}. ${item}`).join("\n");
  const n = sectionItems.length;
  const prompt = `Rewrite the ${sectionType} section${roleContext}${industryContext}.

Section Type: ${sectionType}
Number of Items: ${n}

Rules:
1. Rewrite ALL ${n} items. Return exactly ${n} items in the same order.
2. Use strong action verbs — no two items should start with the same verb.
3. If an item has numbers or metrics, preserve them exactly. If not, do NOT invent them.
4. Vary sentence structure across items — avoid repeating the same pattern.
5. NEVER fabricate, exaggerate, or add skills, responsibilities, or achievements not explicitly mentioned in the original items.
6. Everything must be interview-safe — the candidate must be able to defend every rewritten line.
7. Preserve all company names, job titles, dates, degree names, and institution names exactly as provided — do not change them.

Original Items:
${itemsList}

Respond in ${lang}.
Return JSON only: {"items": ["...", "...", ...]}`;

  const raw = await callAI(prompt, IMPROVE_SECTION_SYSTEM, 1000);
  if (!raw) return null;
  const parsed = parseJSON(raw) as { items?: string[] } | null;
  if (parsed?.items && Array.isArray(parsed.items) && parsed.items.length === n) return parsed.items;
  return null;
}

const SUGGEST_SKILLS_SYSTEM = "You are a senior technical recruiter and career coach with 20+ years of experience evaluating resumes. You identify the skills a candidate should list to pass ATS filters and catch a recruiter's attention. Respond with valid JSON only — no markdown, no code fences, no explanation. Use this exact structure: {\"skills\": [\"Skill 1\", \"Skill 2\", \"...\"], \"reasoning\": \"Brief explanation\"}";

export async function suggestSkills(
  resumeText: string,
  locale = "en",
  jobTitle?: string,
  industry?: string,
): Promise<{ skills: string[]; reasoning: string } | null> {
  const lang = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || "English";
  const roleText = jobTitle || "professional";
  const industryText = industry || "general";
  const prompt = `Suggest 8-12 skills for a ${roleText} targeting the ${industryText} industry. Analyze the resume content below to determine what the candidate likely knows and what complementary skills would strengthen their profile.

Candidate Profile:
${resumeText}

Rules:
1. Include skills the candidate's experience implies they have (e.g., if they mention building APIs, include REST and backend frameworks).
2. Add high-demand skills for a ${roleText} in ${industryText} that would fill obvious gaps in their profile.
3. Mix technical skills, tools, methodologies, and 2-3 soft skills relevant to the role.
4. Order by relevance — most important skills first.
5. NEVER suggest skills the candidate could not reasonably possess based on their experience level.
6. Do NOT list skills already explicitly mentioned in their resume unless expanding to a more specific or adjacent version.
7. Return 8-12 skills total. No more, no less.

Respond in ${lang}.
Return JSON only: {"skills": ["Skill 1", "Skill 2", "..."], "reasoning": "..."}`;

  const raw = await callAI(prompt, SUGGEST_SKILLS_SYSTEM, 800);
  if (!raw) return null;
  const parsed = parseJSON(raw) as { skills?: string[]; reasoning?: string } | null;
  if (parsed?.skills && Array.isArray(parsed.skills)) {
    return { skills: parsed.skills, reasoning: parsed.reasoning || "" };
  }
  return null;
}

const IMPROVE_SUMMARY_SYSTEM = "You are a professional resume writer with 20+ years of experience writing executive summaries that get candidates shortlisted. You synthesize a candidate's full background into a compelling 3-4 sentence summary. Respond with valid JSON only — no markdown, no code fences, no explanation. Use this exact structure: {\"summary\": \"The rewritten summary\", \"changedFrom\": \"What was improved\"}";

export async function improveSummary(
  currentSummary: string,
  resumeText: string,
  locale = "en",
  jobTitle?: string,
  industry?: string,
): Promise<{ summary: string; changedFrom: string } | null> {
  const lang = LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS] || "English";
  const roleText = jobTitle || "professional";
  const industryText = industry || "general";
  const prompt = `Rewrite the professional summary for a ${roleText} targeting the ${industryText} industry. Use the candidate's full resume below as source material — the summary must reflect what the resume actually demonstrates, not what it claims.

Current Summary:
${currentSummary}

Full Resume for Context:
${resumeText}

Rules:
1. Keep it 3-4 sentences.
2. Lead with the candidate's strongest differentiator — what makes them hireable at a glance.
3. Mention years of experience and industry focus if present in the resume.
4. Highlight 2-3 concrete skills or achievements from the resume that are most relevant to a ${roleText} role.
5. NEVER fabricate, exaggerate, or claim experience, skills, or achievements not present in the resume content.
6. Do NOT repeat the job title as the first sentence — start with value.
7. Everything must be interview-safe.

Respond in ${lang}.
Return JSON only: {"summary": "...", "changedFrom": "..."}`;

  const raw = await callAI(prompt, IMPROVE_SUMMARY_SYSTEM, 800);
  if (!raw) return null;
  const parsed = parseJSON(raw) as { summary?: string; changedFrom?: string } | null;
  if (parsed?.summary) return { summary: parsed.summary, changedFrom: parsed.changedFrom || "" };
  return null;
}
