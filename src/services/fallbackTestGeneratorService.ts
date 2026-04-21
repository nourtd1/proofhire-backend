import type { TestQuestion } from '../models/MiniTest'
import type { SkillType } from '../types/profile'

export type CandidateQuestion = Omit<TestQuestion, 'correctAnswer'>

const levelWeight: Record<SkillType['level'], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
}

const normalizeSkillName = (value: string): string => value.trim() || 'Software Engineering'

const pickTopSkills = (skills: SkillType[]): string[] => {
  const ranked = [...skills].sort((left, right) => {
    const scoreLeft = levelWeight[left.level] * 10 + left.yearsOfExperience
    const scoreRight = levelWeight[right.level] * 10 + right.yearsOfExperience
    return scoreRight - scoreLeft
  })

  const chosen = ranked.slice(0, 3).map((skill) => normalizeSkillName(skill.name))
  if (chosen.length === 0) {
    return ['Problem Solving', 'Code Quality', 'Debugging']
  }
  while (chosen.length < 3) {
    chosen.push(chosen[chosen.length - 1])
  }
  return chosen
}

const buildQuestion = (
  id: string,
  skill: string,
  difficulty: TestQuestion['difficulty'],
  question: string,
  options: string[],
  correctAnswer: number
): TestQuestion => ({
  id,
  skill,
  difficulty,
  question,
  options,
  correctAnswer,
})

export function generateFallbackTestQuestions(
  candidateName: string,
  skills: SkillType[],
  jobTitle: string
): { questionsForCandidate: CandidateQuestion[]; questionsWithAnswers: TestQuestion[] } {
  const [primarySkill, secondarySkill, tertiarySkill] = pickTopSkills(skills)
  const subject = candidateName.trim() || 'Candidate'

  const questionsWithAnswers: TestQuestion[] = [
    buildQuestion(
      'q1',
      primarySkill,
      'easy',
      `For a ${jobTitle} role, which first step is the safest when starting work in ${primarySkill}?`,
      [
        `Review the existing requirements, constraints, and current implementation before changing code`,
        `Rewrite the feature immediately so the stack becomes more familiar`,
        `Skip tests because they slow down early progress`,
        `Delay understanding the current system until after release`,
      ],
      0
    ),
    buildQuestion(
      'q2',
      secondarySkill,
      'easy',
      `${subject} claims ${secondarySkill}. Which action best demonstrates solid practical understanding?`,
      [
        `Making small, testable changes and validating the result with logs or tooling`,
        `Changing multiple modules at once to save time`,
        `Avoiding documentation because implementation details speak for themselves`,
        `Ignoring edge cases until users report them`,
      ],
      0
    ),
    buildQuestion(
      'q3',
      primarySkill,
      'medium',
      `A feature built with ${primarySkill} works locally but fails in production. What should be done first?`,
      [
        `Collect the failing request details, environment differences, and relevant logs before patching`,
        `Disable monitoring so the logs do not grow too quickly`,
        `Rebuild the whole module from scratch without investigation`,
        `Assume the infrastructure is wrong and wait for another team`,
      ],
      0
    ),
    buildQuestion(
      'q4',
      tertiarySkill,
      'medium',
      `Which approach is most appropriate when reviewing a pull request that affects ${tertiarySkill}?`,
      [
        `Check correctness, edge cases, readability, and whether the change fits the existing architecture`,
        `Approve quickly if the code compiles, regardless of behavior`,
        `Focus only on formatting and ignore reliability concerns`,
        `Request a full rewrite before understanding the author's intent`,
      ],
      0
    ),
    buildQuestion(
      'q5',
      secondarySkill,
      'hard',
      `In a high-impact ${jobTitle} workflow, what is the best way to reduce risk while shipping a major change involving ${secondarySkill}?`,
      [
        `Release behind validation steps or phased rollout controls so behavior can be checked safely`,
        `Bundle unrelated refactors together so there is only one deployment`,
        `Skip observability because successful code should not need monitoring`,
        `Merge directly to production without a rollback path`,
      ],
      0
    ),
  ]

  return {
    questionsForCandidate: questionsWithAnswers.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      skill: question.skill,
      difficulty: question.difficulty,
    })),
    questionsWithAnswers,
  }
}
