import { GoogleGenerativeAI } from '@google/generative-ai'
import type { SkillType } from '../types/profile'
import type { TestQuestion } from '../models/MiniTest'

export type CandidateQuestion = Omit<TestQuestion, 'correctAnswer'>

export async function generateTestQuestions(
  candidateName: string,
  skills: SkillType[],
  jobTitle: string
): Promise<{ questionsForCandidate: CandidateQuestion[]; questionsWithAnswers: TestQuestion[] }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please set it in your environment.')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `You are a technical assessment expert for Umurava, an African tech talent platform.
Your job is to create fair, practical, and relevant technical questions to verify 
a developer's claimed skills.

RULES:
- Questions must be practical and based on real-world scenarios
- Avoid trick questions — test genuine understanding
- Questions should be solvable in 1-2 minutes each
- Context should be relevant to African tech projects when possible
  (e.g. mobile money integrations, low-bandwidth scenarios, offline-first apps)
- Use simple, clear English — no ambiguity
- Wrong answers must be plausible (not obviously wrong)`,
  })

  const stripCodeFences = (text: string): string => {
    const trimmed = text.trim()
    const withoutStart = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '')
    const withoutEnd = withoutStart.replace(/```$/i, '')
    return withoutEnd.trim()
  }

  const prompt = `Generate exactly 5 multiple-choice technical questions to verify the skills of a developer 
applying for the role of "${jobTitle}".

CANDIDATE PROFILE:
Name: ${candidateName}
Declared Skills:
${skills.map((s) => `  - ${s.name}: ${s.level} level, ${s.yearsOfExperience} years`).join('\n')}

INSTRUCTIONS:
1. Select the 3 most important skills from the list above (prioritize those listed as Advanced or Expert)
2. Generate 5 questions total — distribute across the selected skills
3. Mix difficulty: 2 easy, 2 medium, 1 hard
4. Each question has exactly 4 answer options (index 0, 1, 2, 3)
5. correctAnswer is the index of the ONLY correct option
6. The "skill" field must match exactly one of the skill names listed above

IMPORTANT: Return ONLY a valid JSON array. No markdown, no explanation outside JSON.

Return this EXACT format:
[
  {
    "id": "q1",
    "question": "In React, what is the correct way to update state that depends on the previous state value?",
    "options": [
      "setState(newValue)",
      "setState(prev => prev + newValue)",
      "this.state = newValue",
      "updateState(newValue)"
    ],
    "correctAnswer": 1,
    "skill": "React",
    "difficulty": "medium"
  }
]`

  const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
  const isDifficulty = (v: unknown): v is TestQuestion['difficulty'] =>
    v === 'easy' || v === 'medium' || v === 'hard'

  const validateQuestion = (v: unknown): v is TestQuestion => {
    if (typeof v !== 'object' || v === null) return false
    const q = v as Record<string, unknown>
    if (!isNonEmptyString(q.id)) return false
    if (!isNonEmptyString(q.question)) return false
    if (!Array.isArray(q.options) || q.options.length !== 4 || !q.options.every((x) => isNonEmptyString(x))) return false
    if (typeof q.correctAnswer !== 'number' || !Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3)
      return false
    if (!isNonEmptyString(q.skill)) return false
    if (!isDifficulty(q.difficulty)) return false
    return true
  }

  try {
    const response = await model.generateContent(prompt)
    const responseTextRaw = response.response.text()
    const responseText = stripCodeFences(responseTextRaw)

    let parsed: unknown
    try {
      parsed = JSON.parse(responseText)
    } catch {
      throw new Error('Gemini returned invalid test questions')
    }

    if (!Array.isArray(parsed) || parsed.length !== 5) {
      throw new Error('Gemini returned invalid test questions')
    }

    const list = parsed as unknown[]
    if (!list.every(validateQuestion)) {
      throw new Error('Gemini returned invalid test questions')
    }

    const questions = list as TestQuestion[]

    console.log(
      `[TestGen] Generated 5 questions for ${candidateName} — skills: ${skills.map((s) => s.name).join(', ')}`
    )

    return {
      questionsForCandidate: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        skill: q.skill,
        difficulty: q.difficulty,
      })),
      questionsWithAnswers: questions,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown Gemini error'
    if (msg === 'Gemini returned invalid test questions') throw new Error(msg)
    throw new Error(`Gemini API error: ${msg}`)
  }
}

