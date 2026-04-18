import { Request, Response } from 'express'
import mongoose from 'mongoose'
import MiniTest, { MiniTestDocument, TestQuestion } from '../models/MiniTest'
import Applicant from '../models/Applicant'
import Job from '../models/Job'
import { generateTestQuestions } from '../services/testGeneratorService'
import type { SkillType } from '../types/profile'

type ApiSuccess<T> = { success: true; data: T; message?: string }
type ApiError = { success: false; message: string }

const getErrorMessage = (err: unknown): string => (err instanceof Error ? err.message : 'Unknown error')
const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0

type CandidateQuestion = Omit<TestQuestion, 'correctAnswer'>

const withoutCorrectAnswers = (questions: TestQuestion[]): CandidateQuestion[] =>
  questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    skill: q.skill,
    difficulty: q.difficulty,
  }))

const computeRemainingSeconds = (startedAt: Date, totalSeconds = 300): number => {
  const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000)
  const remaining = totalSeconds - elapsed
  return Math.max(0, remaining)
}

// POST /api/tests/generate
// Body: { applicantId: string, jobId: string }
export const generateTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as unknown
    const applicantId = (body as { applicantId?: unknown }).applicantId
    const jobId = (body as { jobId?: unknown }).jobId

    if (!isNonEmptyString(applicantId) || !isNonEmptyString(jobId)) {
      const payload: ApiError = { success: false, message: 'applicantId and jobId are required' }
      res.status(400).json(payload)
      return
    }

    const applicant = await Applicant.findById(applicantId)
    if (!applicant) {
      const payload: ApiError = { success: false, message: 'Applicant not found' }
      res.status(404).json(payload)
      return
    }

    const job = await Job.findById(jobId)
    if (!job) {
      const payload: ApiError = { success: false, message: 'Job not found' }
      res.status(404).json(payload)
      return
    }

    const existingTest = await MiniTest.findOne({ applicantId, jobId, status: 'completed' })
    if (existingTest) {
      const payload: ApiError = { success: false, message: 'This candidate has already completed the test' }
      res.status(400).json(payload)
      return
    }

    const profile = applicant.profile as unknown as { firstName?: string; lastName?: string; skills?: SkillType[] }
    const candidateName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || 'Candidate'
    const skills = Array.isArray(profile.skills) ? profile.skills : []

    const { questionsForCandidate, questionsWithAnswers } = await generateTestQuestions(candidateName, skills, job.title)

    const test = new MiniTest({
      applicantId: new mongoose.Types.ObjectId(applicantId),
      jobId: new mongoose.Types.ObjectId(jobId),
      questions: questionsWithAnswers,
      answers: [],
      score: 0,
      passed: false,
      status: 'pending',
    })
    await test.save()

    const payload: ApiSuccess<{ testId: string; questions: CandidateQuestion[] }> = {
      success: true,
      data: { testId: test._id.toString(), questions: questionsForCandidate },
      message: 'Test generated successfully',
    }
    res.status(201).json(payload)
  } catch (err: unknown) {
    const payload: ApiError = { success: false, message: getErrorMessage(err) }
    res.status(500).json(payload)
  }
}

// POST /api/tests/submit
// Body: { testId: string, answers: number[] }
export const submitTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as unknown
    const testId = (body as { testId?: unknown }).testId
    const answers = (body as { answers?: unknown }).answers

    if (!isNonEmptyString(testId) || !Array.isArray(answers)) {
      const payload: ApiError = { success: false, message: 'testId and answers are required' }
      res.status(400).json(payload)
      return
    }

    if (!answers.every((x) => typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= 3)) {
      const payload: ApiError = { success: false, message: 'answers must be an array of integers between 0 and 3' }
      res.status(400).json(payload)
      return
    }

    const test = await MiniTest.findById(testId)
    if (!test) {
      const payload: ApiError = { success: false, message: 'Test not found' }
      res.status(404).json(payload)
      return
    }

    if (test.status === 'completed') {
      const payload: ApiError = { success: false, message: 'Test already completed' }
      res.status(400).json(payload)
      return
    }

    if (answers.length !== test.questions.length) {
      const payload: ApiError = { success: false, message: 'answers length must match the number of questions' }
      res.status(400).json(payload)
      return
    }

    let correctCount = 0
    test.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) correctCount += 1
    })
    const score = Math.round((correctCount / test.questions.length) * 100)
    const passed = score >= 70

    test.answers = answers
    test.score = score
    test.passed = passed
    test.status = 'completed'
    test.completedAt = new Date()
    await test.save()

    const applicant = await Applicant.findById(test.applicantId)
    const profile = applicant?.profile as unknown as { firstName?: string; lastName?: string }
    const candidateName = `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim() || 'Candidate'

    if (passed) {
      await Applicant.findByIdAndUpdate(test.applicantId, { isVerified: true })
      console.log(`[Test] ${candidateName} passed with ${score}% — profile verified!`)
    } else {
      console.log(`[Test] ${candidateName} failed with ${score}% — profile not verified`)
    }

    const payload: ApiSuccess<{
      score: number
      passed: boolean
      correctCount: number
      totalQuestions: number
      message: string
      breakdown: Array<{
        questionId: string
        skill: string
        correct: boolean
        yourAnswer: number
        correctAnswer: number
      }>
    }> = {
      success: true,
      data: {
        score,
        passed,
        correctCount,
        totalQuestions: test.questions.length,
        message: passed
          ? 'Congratulations! Your profile is now Verified ✓'
          : 'Keep practicing! You need 70% to get verified.',
        breakdown: test.questions.map((q, i) => ({
          questionId: q.id,
          skill: q.skill,
          correct: answers[i] === q.correctAnswer,
          yourAnswer: answers[i],
          correctAnswer: q.correctAnswer,
        })),
      },
    }

    res.json(payload)
  } catch (err: unknown) {
    const payload: ApiError = { success: false, message: getErrorMessage(err) }
    res.status(500).json(payload)
  }
}

// GET /api/tests/:applicantId
// Returns the latest test for an applicant (sanitized: never expose correctAnswer in questions)
export const getTestByApplicant = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicantId = req.params.applicantId
    const start = (req.query as Record<string, unknown>).start
    const shouldStart = start === 'true' || start === '1'

    const test = (await MiniTest.findOne({ applicantId }).sort({ createdAt: -1 })) as MiniTestDocument | null
    if (!test) {
      const payload: ApiSuccess<null> = { success: true, data: null }
      res.json(payload)
      return
    }

    if (shouldStart && test.status === 'pending') {
      test.status = 'in_progress'
      test.startedAt = new Date()
      await test.save()
    }

    const remainingSeconds = test.startedAt && test.status === 'in_progress' ? computeRemainingSeconds(test.startedAt) : 300

    if (test.status === 'completed') {
      const correctCount = test.answers.reduce((acc, a, idx) => (a === test.questions[idx]?.correctAnswer ? acc + 1 : acc), 0)
      const message = test.passed
        ? 'Congratulations! Your profile is now Verified ✓'
        : 'Keep practicing! You need 70% to get verified.'

      const payload: ApiSuccess<{
        _id: string
        applicantId: string
        jobId: string
        status: MiniTestDocument['status']
        score: number
        passed: boolean
        answers: number[]
        startedAt?: Date
        completedAt?: Date
        createdAt: Date
        questions: CandidateQuestion[]
        result: {
          score: number
          passed: boolean
          correctCount: number
          totalQuestions: number
          message: string
          breakdown: Array<{
            questionId: string
            skill: string
            correct: boolean
            yourAnswer: number
            correctAnswer: number
          }>
        }
      }> = {
        success: true,
        data: {
          _id: test._id.toString(),
          applicantId: test.applicantId.toString(),
          jobId: test.jobId.toString(),
          status: test.status,
          score: test.score,
          passed: test.passed,
          answers: test.answers,
          startedAt: test.startedAt,
          completedAt: test.completedAt,
          createdAt: test.createdAt,
          questions: withoutCorrectAnswers(test.questions),
          result: {
            score: test.score,
            passed: test.passed,
            correctCount,
            totalQuestions: test.questions.length,
            message,
            breakdown: test.questions.map((q, i) => ({
              questionId: q.id,
              skill: q.skill,
              correct: test.answers[i] === q.correctAnswer,
              yourAnswer: test.answers[i],
              correctAnswer: q.correctAnswer,
            })),
          },
        },
      }
      res.json(payload)
      return
    }

    const payload: ApiSuccess<{
      _id: string
      applicantId: string
      jobId: string
      status: MiniTestDocument['status']
      answers: number[]
      timeLeft: number
      startedAt?: Date
      createdAt: Date
      questions: CandidateQuestion[]
    }> = {
      success: true,
      data: {
        _id: test._id.toString(),
        applicantId: test.applicantId.toString(),
        jobId: test.jobId.toString(),
        status: test.status,
        answers: test.answers,
        timeLeft: remainingSeconds,
        startedAt: test.startedAt,
        createdAt: test.createdAt,
        questions: withoutCorrectAnswers(test.questions),
      },
    }
    res.json(payload)
  } catch (err: unknown) {
    const payload: ApiError = { success: false, message: getErrorMessage(err) }
    res.status(500).json(payload)
  }
}

