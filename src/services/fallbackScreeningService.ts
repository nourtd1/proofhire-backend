import type { ApplicantType, JobType, SingleScreeningResult, SkillType } from '../types/profile'

type Recommendation = SingleScreeningResult['recommendation']

const levelWeight: Record<SkillType['level'], number> = {
  Beginner: 0.35,
  Intermediate: 0.6,
  Advanced: 0.82,
  Expert: 1,
}

const normalize = (value: string): string => value.trim().toLowerCase()

const unique = (values: string[]): string[] => [...new Set(values.filter((value) => value.trim().length > 0))]

const toWords = (value: string): string[] =>
  value
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/i)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2)

const estimateRequiredYears = (experienceLevel: string): number => {
  const level = experienceLevel.toLowerCase()
  if (level.includes('lead') || level.includes('principal') || level.includes('staff')) return 6
  if (level.includes('senior')) return 5
  if (level.includes('mid')) return 3
  if (level.includes('junior') || level.includes('entry') || level.includes('associate')) return 1
  return 2
}

const buildApplicantKeywordSet = (applicant: ApplicantType): Set<string> => {
  const values = [
    applicant.profile.headline,
    applicant.profile.bio,
    applicant.resumeText ?? '',
    ...applicant.profile.skills.map((skill) => skill.name),
    ...applicant.profile.experience.flatMap((item) => [
      item.role,
      item.company,
      item.description,
      ...item.technologies,
    ]),
    ...(applicant.profile.projects ?? []).flatMap((project) => [
      project.name,
      project.role,
      project.description,
      ...project.technologies,
    ]),
    ...applicant.profile.education.flatMap((item) => [item.degree, item.fieldOfStudy, item.institution]),
    ...(applicant.profile.certifications ?? []).flatMap((item) => [item.name, item.issuer]),
  ]

  return new Set(values.flatMap(toWords))
}

const countRequirementMatches = (requirements: string[], applicantKeywords: Set<string>): number =>
  requirements.reduce((count, requirement) => {
    const words = unique(toWords(requirement))
    if (words.length === 0) return count
    return words.some((word) => applicantKeywords.has(word)) ? count + 1 : count
  }, 0)

const getMatchedSkills = (job: JobType, applicant: ApplicantType): SkillType[] => {
  const requiredSkills = new Set(job.skills.map(normalize))
  return applicant.profile.skills.filter((skill) => requiredSkills.has(normalize(skill.name)))
}

const getMissingSkills = (job: JobType, applicant: ApplicantType): string[] => {
  const applicantSkills = new Set(applicant.profile.skills.map((skill) => normalize(skill.name)))
  return job.skills.filter((skill) => !applicantSkills.has(normalize(skill)))
}

const computeExperienceYears = (matchedSkills: SkillType[], applicant: ApplicantType): number => {
  const directYears = matchedSkills.map((skill) => skill.yearsOfExperience)
  const fallbackYears = applicant.profile.experience.length * 1.5
  const bestDirect = directYears.length > 0 ? Math.max(...directYears) : 0
  return Math.max(bestDirect, fallbackYears)
}

const buildStrengths = (
  job: JobType,
  applicant: ApplicantType,
  matchedSkills: SkillType[],
  requirementMatches: number,
  estimatedYears: number
): string[] => {
  const strengths: string[] = []
  const availability = applicant.profile.availability.status

  if (matchedSkills.length > 0) {
    strengths.push(
      `${matchedSkills.length}/${Math.max(job.skills.length, 1)} required skills matched: ${matchedSkills
        .slice(0, 4)
        .map((skill) => skill.name)
        .join(', ')}.`
    )
  }

  const advancedSkills = matchedSkills.filter(
    (skill) => skill.level === 'Advanced' || skill.level === 'Expert'
  )
  if (advancedSkills.length > 0) {
    strengths.push(
      `Strong declared depth in ${advancedSkills
        .slice(0, 3)
        .map((skill) => skill.name)
        .join(', ')} based on the candidate profile.`
    )
  }

  if (requirementMatches > 0) {
    strengths.push(
      `${requirementMatches}/${Math.max(job.requirements.length, 1)} job requirements are supported by the resume, projects, or experience history.`
    )
  }

  if ((applicant.profile.projects ?? []).length > 0) {
    strengths.push(
      `${(applicant.profile.projects ?? []).length} listed project(s) give extra evidence of hands-on delivery.`
    )
  }

  if (estimatedYears >= estimateRequiredYears(job.experienceLevel)) {
    strengths.push(
      `Estimated relevant experience is aligned with the ${job.experienceLevel || 'target'} level for this role.`
    )
  }

  if (availability === 'Available' || availability === 'Open to Opportunities') {
    strengths.push(`Availability is favorable for hiring (${availability}).`)
  }

  if (strengths.length === 0) {
    strengths.push('The profile includes enough structured information to evaluate the candidate consistently.')
  }

  return strengths.slice(0, 5)
}

const buildGaps = (
  job: JobType,
  applicant: ApplicantType,
  missingSkills: string[],
  requirementMatches: number,
  estimatedYears: number
): string[] => {
  const gaps: string[] = []
  const requiredYears = estimateRequiredYears(job.experienceLevel)

  if (missingSkills.length > 0) {
    gaps.push(`Missing direct evidence for: ${missingSkills.slice(0, 4).join(', ')}.`)
  }

  if (job.requirements.length > 0 && requirementMatches < job.requirements.length) {
    gaps.push(
      `Some requirements are not clearly demonstrated in the submitted profile (${requirementMatches}/${job.requirements.length} evidenced).`
    )
  }

  if (estimatedYears < requiredYears) {
    gaps.push(
      `Estimated relevant experience is below the expected level for a ${job.experienceLevel || 'target'} role.`
    )
  }

  if ((applicant.profile.projects ?? []).length === 0) {
    gaps.push('No project portfolio was listed to reinforce the claimed skills.')
  }

  if (applicant.profile.availability.status === 'Not Available') {
    gaps.push('Current availability may delay hiring even if the profile is otherwise strong.')
  }

  while (gaps.length < 2) {
    gaps.push('More measurable outcomes in the profile would improve confidence in the evaluation.')
  }

  return gaps.slice(0, 4)
}

const toRecommendation = (score: number): Recommendation => {
  if (score >= 75) return 'Hire'
  if (score >= 50) return 'Maybe'
  return 'Pass'
}

type RankedCandidate = {
  applicantId: string
  matchScore: number
  strengths: string[]
  gaps: string[]
  recommendation: Recommendation
  reasoning: string
  sortKey: number
}

export function screenApplicantsWithFallback(
  job: JobType,
  applicants: ApplicantType[],
  failureReason?: string
): SingleScreeningResult[] {
  const ranked: RankedCandidate[] = applicants.map((applicant) => {
    const applicantId = applicant._id.toString()
    const matchedSkills = getMatchedSkills(job, applicant)
    const missingSkills = getMissingSkills(job, applicant)
    const applicantKeywords = buildApplicantKeywordSet(applicant)
    const requirementMatches = countRequirementMatches(job.requirements, applicantKeywords)
    const estimatedYears = computeExperienceYears(matchedSkills, applicant)

    const skillCoverageScore =
      job.skills.length > 0 ? Math.round((matchedSkills.length / job.skills.length) * 42) : 18

    const skillDepthScore =
      matchedSkills.length > 0
        ? Math.round(
            (matchedSkills.reduce((sum, skill) => sum + levelWeight[skill.level], 0) / matchedSkills.length) *
              18
          )
        : 0

    const requirementScore =
      job.requirements.length > 0 ? Math.round((requirementMatches / job.requirements.length) * 15) : 8

    const experienceTarget = estimateRequiredYears(job.experienceLevel)
    const experienceScore = Math.round(Math.min(estimatedYears / experienceTarget, 1) * 15)

    const projectScore = Math.min((applicant.profile.projects ?? []).length, 3) * 3
    const availabilityScore =
      applicant.profile.availability.status === 'Available'
        ? 7
        : applicant.profile.availability.status === 'Open to Opportunities'
          ? 4
          : 0

    const rawScore =
      skillCoverageScore +
      skillDepthScore +
      requirementScore +
      experienceScore +
      projectScore +
      availabilityScore

    const matchScore = Math.max(0, Math.min(100, Math.round(rawScore)))
    const recommendation = toRecommendation(matchScore)
    const strengths = buildStrengths(job, applicant, matchedSkills, requirementMatches, estimatedYears)
    const gaps = buildGaps(job, applicant, missingSkills, requirementMatches, estimatedYears)

    const explanationBits = [
      `Backup scoring matched ${matchedSkills.length}/${job.skills.length || 0} required skills`,
      `found evidence for ${requirementMatches}/${job.requirements.length || 0} requirements`,
      `and estimated ${estimatedYears.toFixed(1)} year(s) of relevant experience`,
    ]

    if (failureReason) {
      explanationBits.push(`because Gemini is unavailable (${failureReason}).`)
    } else {
      explanationBits.push('because Gemini is unavailable.')
    }

    const reasoning = `${explanationBits.join(' ')} Recommendation: ${recommendation}.`

    return {
      applicantId,
      matchScore,
      strengths,
      gaps,
      recommendation,
      reasoning,
      sortKey:
        matchScore * 1000 +
        matchedSkills.length * 100 +
        requirementMatches * 10 +
        `${applicant.profile.firstName} ${applicant.profile.lastName}`.trim().length,
    }
  })

  ranked.sort((left, right) => right.sortKey - left.sortKey)

  return ranked.map((candidate, index) => ({
    applicantId: candidate.applicantId,
    matchScore: candidate.matchScore,
    strengths: candidate.strengths,
    gaps: candidate.gaps,
    recommendation: candidate.recommendation,
    reasoning: candidate.reasoning,
    rank: index + 1,
  }))
}
