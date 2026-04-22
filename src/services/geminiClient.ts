import { GoogleGenerativeAI, type GenerateContentRequest, type GenerateContentResult, type GenerativeModel } from '@google/generative-ai'
import { normalizeGeminiError } from './aiErrorUtils'

export const GEMINI_MODEL = 'gemini-2.0-flash-lite'

export const readGeminiApiKey = (): string => {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY

  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('GOOGLE_API_KEY is missing. Please set it in your environment.')
  }

  return apiKey.trim()
}

export const createGeminiClient = (): GoogleGenerativeAI => {
  return new GoogleGenerativeAI(readGeminiApiKey())
}

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

type GenerateWithRetryOptions = {
  maxAttempts?: number
  initialDelayMs?: number
}

export const generateContentWithRetry = async (
  model: GenerativeModel,
  request: string | GenerateContentRequest,
  options: GenerateWithRetryOptions = {}
): Promise<GenerateContentResult> => {
  const maxAttempts = options.maxAttempts ?? 4
  const initialDelayMs = options.initialDelayMs ?? 1500

  let attempt = 0
  let delayMs = initialDelayMs

  while (attempt < maxAttempts) {
    attempt += 1

    try {
      return await model.generateContent(request)
    } catch (error: unknown) {
      const normalizedError = normalizeGeminiError(error)
      const shouldRetry = normalizedError.retriable && attempt < maxAttempts

      if (!shouldRetry) {
        throw error
      }

      console.warn(
        `[Gemini] Attempt ${attempt}/${maxAttempts} failed (${normalizedError.code}). Retrying in ${delayMs}ms.`
      )
      await sleep(delayMs)
      delayMs *= 2
    }
  }

  throw new Error('Gemini request failed after all retry attempts')
}
