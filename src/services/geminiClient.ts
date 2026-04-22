import { GoogleGenerativeAI } from '@google/generative-ai'

export const GEMINI_MODEL = 'gemini-2.5-flash'

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
