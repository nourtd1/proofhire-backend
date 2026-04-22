import { SchemaType, type Schema } from '@google/generative-ai'
import type {
  ApplicantType,
  CertificationType,
  EducationType,
  ExperienceType,
  JobType,
  ProjectType,
  SkillType,
} from '../types/profile'
import { normalizeGeminiError } from './aiErrorUtils'
import { createGeminiClient, GEMINI_MODEL } from './geminiClient'

export interface SingleScreeningResult {
  applicantId: string
  matchScore: number
  strengths: string[]
  gaps: string[]
  recommendation: 'Hire' | 'Maybe' | 'Pass'
  reasoning: string
  rank: number
}

const screeningResultItemSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    applicantId: { type: SchemaType.STRING },
    matchScore: { type: SchemaType.INTEGER },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    gaps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    recommendation: { type: SchemaType.STRING },
    reasoning: { type: SchemaType.STRING },
    rank: { type: SchemaType.INTEGER },
  },
  required: ['applicantId', 'matchScore', 'strengths', 'gaps', 'recommendation', 'reasoning', 'rank'],
}

const screeningResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    results: {
      type: SchemaType.ARRAY,
      items: screeningResultItemSchema,
    },
  },
  required: ['results'],
}

const createGeminiModel = () => {
  const genAI = createGeminiClient()
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: screeningResponseSchema,
    },
    systemInstruction: `You are an expert AI recruiter assistant for Umurava, Africa's leading tech talent platform.
Your mission is to fairly evaluate candidates for technical roles with deep understanding
of the African tech ecosystem and its unique context.

IMPORTANT FAIRNESS RULES:
- A developer from Kigali, Lagos, or Nairobi with strong open source contributions or
  hackathon wins is equally valuable as one with a FAANG background.
- Do NOT penalize candidates for studying at African universities - judge the skills,
  not the institution name.
- Evaluate based on: skill match, project quality, experience relevance, and growth trajectory.
- Be honest about gaps but constructive - frame them as "areas to develop" not disqualifiers.
- A candidate who built a fintech app for East African users demonstrates real-world impact.`,
  })
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim().length > 0)

const isRecommendation = (value: unknown): value is SingleScreeningResult['recommendation'] =>
  value === 'Hire' || value === 'Maybe' || value === 'Pass'

const validateResultItem = (value: unknown): value is SingleScreeningResult => {
  if (typeof value !== 'object' || value === null) return false
  const result = value as Record<string, unknown>

  if (!isNonEmptyString(result.applicantId)) return false
  if (!isNumber(result.matchScore) || !Number.isInteger(result.matchScore) || result.matchScore < 0 || result.matchScore > 100)
    return false
  if (!isStringArray(result.strengths) || result.strengths.length < 3 || result.strengths.length > 5) return false
  if (!isStringArray(result.gaps) || result.gaps.length < 2 || result.gaps.length > 4) return false
  if (!isRecommendation(result.recommendation)) return false
  if (!isNonEmptyString(result.reasoning)) return false
  if (!isNumber(result.rank) || !Number.isInteger(result.rank) || result.rank < 1) return false

  return true
}

const buildPrompt = (job: JobType, applicants: ApplicantType[]): string => {
  const requirements = job.requirements.map((requirement: string) => `  - ${requirement}`).join('\n')

  const applicantsBlock = applicants
    .map((applicant, index) => {
      const skills = applicant.profile.skills
        .map((skill: SkillType) => `|   - ${skill.name}: ${skill.level} (${skill.yearsOfExperience} years)`)
        .join('\n')

      const experience = applicant.profile.experience
        .map(
          (item: ExperienceType) =>
            `|   - ${item.role} at ${item.company} (${item.startDate} -> ${item.endDate})\n|     ${item.description}\n|     Tech: ${item.technologies.join(
              ', '
            )}`
        )
        .join('\n')

      const projects = (applicant.profile.projects ?? [])
        .map(
          (project: ProjectType) =>
            `|   - ${project.name}: ${project.description}\n|     Technologies: ${project.technologies.join(', ')}`
        )
        .join('\n')

      const education = applicant.profile.education
        .map(
          (item: EducationType) =>
            `|   - ${item.degree} in ${item.fieldOfStudy} - ${item.institution} (${item.startYear}-${item.endYear})`
        )
        .join('\n')

      const certifications =
        applicant.profile.certifications && applicant.profile.certifications.length > 0
          ? applicant.profile.certifications
              .map((certification: CertificationType) => `|   - ${certification.name} by ${certification.issuer}`)
              .join('\n')
          : '|   None listed'

      return `
+-------------------------- APPLICANT ${index + 1} --------------------------+
| ID: ${applicant._id.toString()}
| Name: ${applicant.profile.firstName} ${applicant.profile.lastName}
| Headline: ${applicant.profile.headline}
| Location: ${applicant.profile.location}
|
| SKILLS:
${skills || '|   None listed'}
|
| EXPERIENCE:
${experience || '|   None listed'}
|
| PROJECTS:
${projects || '|   None listed'}
|
| EDUCATION:
${education || '|   None listed'}
|
| CERTIFICATIONS:
${certifications}
|
| AVAILABILITY: ${applicant.profile.availability.status} | ${applicant.profile.availability.type}
+--------------------------------------------------------------------------+
`
    })
    .join('\n')

  return `You are screening applicants for the following job opening:

========================================
JOB DETAILS
========================================
Title: ${job.title}
Experience Level Required: ${job.experienceLevel}
Required Skills: ${job.skills.join(', ')}
Description: ${job.description}
Requirements:
${requirements}

========================================
APPLICANTS TO EVALUATE (${applicants.length} total)
========================================
${applicantsBlock}

========================================
YOUR TASK
========================================
Evaluate ALL ${applicants.length} applicants above against the job requirements.

For each applicant:
1. Assign matchScore (0-100): how well they match this specific job
   - 75-100 = Strong match -> "Hire"
   - 50-74  = Partial match -> "Maybe"
   - 0-49   = Poor match -> "Pass"
2. List 3-5 specific strengths relevant to this job
3. List 2-4 honest gaps relevant to this job
4. Write 2-3 sentence reasoning explaining your recommendation
5. Rank all applicants from 1 (best fit) to ${applicants.length} (worst fit) with no ties

CRITICAL RULES:
- Return only structured JSON matching the response schema.
- Include ALL ${applicants.length} applicants in "results".
- Use the exact applicantId shown above.
- recommendation must be exactly one of: Hire, Maybe, Pass.
- strengths: 3 to 5 strings.
- gaps: 2 to 4 strings.
- matchScore: integer 0-100.`
}

export async function screenApplicants(
  job: JobType,
  applicants: ApplicantType[]
): Promise<SingleScreeningResult[]> {
  const model = createGeminiModel()
  const prompt = buildPrompt(job, applicants)

  try {
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const responseText = response.response.text().trim()

    console.log(`[Gemini] Screened ${applicants.length} applicants for job: ${job.title}`)
    console.log(`[Gemini] Response length: ${responseText.length} characters`)

    let parsed: unknown
    try {
      parsed = JSON.parse(responseText)
    } catch {
      throw new Error('Failed to parse Gemini response as JSON')
    }

    if (typeof parsed !== 'object' || parsed === null || !('results' in parsed)) {
      throw new Error('Gemini returned invalid response format')
    }

    const resultsUnknown = (parsed as { results: unknown }).results
    if (!Array.isArray(resultsUnknown)) {
      throw new Error('Gemini returned invalid response format')
    }

    if (!resultsUnknown.every(validateResultItem)) {
      throw new Error('Gemini returned invalid response format')
    }

    const results = resultsUnknown.slice() as SingleScreeningResult[]

    if (results.length !== applicants.length) {
      console.warn(`[Gemini] Warning: expected ${applicants.length} results but got ${results.length}`)
    }

    results.sort((left, right) => left.rank - right.rank)
    return results
  } catch (err: unknown) {
    throw normalizeGeminiError(err)
  }
}
