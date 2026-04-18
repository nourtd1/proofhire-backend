import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  ApplicantType,
  CertificationType,
  EducationType,
  ExperienceType,
  JobType,
  ProjectType,
  SkillType,
} from '../types/profile';

export interface SingleScreeningResult {
  applicantId: string;
  matchScore: number; // integer 0-100
  strengths: string[]; // 3 to 5 bullet points, each specific to the job
  gaps: string[]; // 2 to 4 bullet points, honest and constructive
  recommendation: 'Hire' | 'Maybe' | 'Pass';
  reasoning: string; // 2 to 3 sentences, natural language, recruiter-friendly
  rank: number; // 1 = best match, no ties allowed
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is missing. Please set it in your environment.');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `You are an expert AI recruiter assistant for Umurava, Africa's leading tech talent platform.
Your mission is to fairly evaluate candidates for technical roles with deep understanding 
of the African tech ecosystem and its unique context.

IMPORTANT FAIRNESS RULES:
- A developer from Kigali, Lagos, or Nairobi with strong open source contributions or 
  hackathon wins is equally valuable as one with a FAANG background.
- Do NOT penalize candidates for studying at African universities — judge the skills, 
  not the institution name.
- Evaluate based on: skill match, project quality, experience relevance, and growth trajectory.
- Be honest about gaps but constructive — frame them as "areas to develop" not disqualifiers.
- A candidate who built a fintech app for East African users demonstrates real-world impact.`,
});

const stripCodeFences = (text: string): string => {
  const trimmed = text.trim();
  const withoutStart = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '');
  const withoutEnd = withoutStart.replace(/```$/i, '');
  return withoutEnd.trim();
};

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string' && x.trim().length > 0);

const isRecommendation = (v: unknown): v is SingleScreeningResult['recommendation'] =>
  v === 'Hire' || v === 'Maybe' || v === 'Pass';

const validateResultItem = (v: unknown): v is SingleScreeningResult => {
  if (typeof v !== 'object' || v === null) return false;
  const r = v as Record<string, unknown>;

  if (!isNonEmptyString(r.applicantId)) return false;
  if (!isNumber(r.matchScore) || !Number.isInteger(r.matchScore) || r.matchScore < 0 || r.matchScore > 100) return false;
  if (!isStringArray(r.strengths) || r.strengths.length < 3 || r.strengths.length > 5) return false;
  if (!isStringArray(r.gaps) || r.gaps.length < 2 || r.gaps.length > 4) return false;
  if (!isRecommendation(r.recommendation)) return false;
  if (!isNonEmptyString(r.reasoning)) return false;
  if (!isNumber(r.rank) || !Number.isInteger(r.rank) || r.rank < 1) return false;

  return true;
};

const buildPrompt = (job: JobType, applicants: ApplicantType[]): string => {
  const requirements = job.requirements.map((r: string) => `  • ${r}`).join('\n');

  const applicantsBlock = applicants
    .map((a, i) => {
      const skills = a.profile.skills
        .map((s: SkillType) => `│   - ${s.name}: ${s.level} (${s.yearsOfExperience} years)`)
        .join('\n');

      const experience = a.profile.experience
        .map(
          (e: ExperienceType) =>
            `│   - ${e.role} at ${e.company} (${e.startDate} → ${e.endDate})\n│     ${e.description}\n│     Tech: ${e.technologies.join(
              ', '
            )}`
        )
        .join('\n');

      const projects = (a.profile.projects ?? [])
        .map(
          (p: ProjectType) =>
            `│   - ${p.name}: ${p.description}\n│     Technologies: ${p.technologies.join(', ')}`
        )
        .join('\n');

      const education = a.profile.education
        .map(
          (e: EducationType) =>
            `│   - ${e.degree} in ${e.fieldOfStudy} — ${e.institution} (${e.startYear}–${e.endYear})`
        )
        .join('\n');

      const certifications =
        a.profile.certifications && a.profile.certifications.length > 0
          ? a.profile.certifications
              .map((c: CertificationType) => `│   - ${c.name} by ${c.issuer}`)
              .join('\n')
          : '│   None listed';

      return `
┌─ APPLICANT ${i + 1} ───────────────────────────
│ ID: ${a._id.toString()}
│ Name: ${a.profile.firstName} ${a.profile.lastName}
│ Headline: ${a.profile.headline}
│ Location: ${a.profile.location}
│ 
│ SKILLS:
${skills || '│   None listed'}
│
│ EXPERIENCE:
${experience || '│   None listed'}
│
│ PROJECTS:
${projects || '│   None listed'}
│
│ EDUCATION:
${education || '│   None listed'}
│
│ CERTIFICATIONS:
${certifications}
│
│ AVAILABILITY: ${a.profile.availability.status} | ${a.profile.availability.type}
└────────────────────────────────────────
`;
    })
    .join('\n');

  return `You are screening applicants for the following job opening:

═══════════════════════════════════════
JOB DETAILS
═══════════════════════════════════════
Title: ${job.title}
Experience Level Required: ${job.experienceLevel}
Required Skills: ${job.skills.join(', ')}
Description: ${job.description}
Requirements:
${requirements}

═══════════════════════════════════════
APPLICANTS TO EVALUATE (${applicants.length} total)
═══════════════════════════════════════
${applicantsBlock}

═══════════════════════════════════════
YOUR TASK
═══════════════════════════════════════
Evaluate ALL ${applicants.length} applicants above against the job requirements.

For each applicant:
1. Assign matchScore (0-100): how well they match this specific job
   - 75-100 = Strong match → "Hire"
   - 50-74  = Partial match → "Maybe"  
   - 0-49   = Poor match → "Pass"
2. List 3-5 SPECIFIC strengths relevant to THIS job (not generic praise)
3. List 2-4 HONEST gaps relevant to THIS job (constructive, not harsh)
4. Write 2-3 sentence reasoning explaining your recommendation
5. Rank all applicants from 1 (best fit) to ${applicants.length} (worst fit) — NO TIES

CRITICAL RULES:
- You MUST return ONLY a valid JSON array — no markdown, no text outside the JSON
- Include ALL ${applicants.length} applicants in your response
- Use the EXACT applicantId string from the ID field above (copy it exactly)
- No two applicants can have the same rank

RETURN THIS EXACT FORMAT:
[
  {
    "applicantId": "exact_id_copied_from_above",
    "matchScore": 87,
    "strengths": [
      "5 years of React experience directly matches the senior requirement",
      "Built a production fintech app with 10,000+ users",
      "Strong TypeScript skills evident in all listed projects"
    ],
    "gaps": [
      "No experience with GraphQL which is mentioned in requirements",
      "Limited exposure to large-scale system design"
    ],
    "recommendation": "Hire",
    "reasoning": "This candidate brings strong frontend expertise with proven production experience in fintech, which is directly relevant to this role. Their open source contributions and hackathon wins demonstrate initiative beyond formal employment. The GraphQL gap is learnable and does not disqualify them.",
    "rank": 1
  }
]`;
};

export async function screenApplicants(
  job: JobType,
  applicants: ApplicantType[]
): Promise<SingleScreeningResult[]> {
  const prompt = buildPrompt(job, applicants);

  try {
    const response = await model.generateContent(prompt);
    const responseTextRaw = response.response.text();
    const responseText = stripCodeFences(responseTextRaw);

    console.log(`[Gemini] Screened ${applicants.length} applicants for job: ${job.title}`);
    console.log(`[Gemini] Response length: ${responseText.length} characters`);

    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      throw new Error('Failed to parse Gemini response as JSON');
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini returned invalid response format');
    }

    const resultsUnknown = parsed as unknown[];
    if (!resultsUnknown.every(validateResultItem)) {
      throw new Error('Gemini returned invalid response format');
    }

    const results = resultsUnknown.slice() as SingleScreeningResult[];

    if (results.length !== applicants.length) {
      console.warn(
        `[Gemini] Warning: expected ${applicants.length} results but got ${results.length}`
      );
    }

    results.sort((a, b) => a.rank - b.rank);
    return results;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown Gemini error';
    if (message === 'Failed to parse Gemini response as JSON' || message === 'Gemini returned invalid response format') {
      throw err instanceof Error ? err : new Error(message);
    }
    throw new Error(`Gemini API error: ${message}`);
  }
}

