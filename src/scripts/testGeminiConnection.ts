import dotenv from 'dotenv'
import { createGeminiClient, GEMINI_MODEL, readGeminiApiKey } from '../services/geminiClient'

dotenv.config()

const maskApiKey = (apiKey: string): string => {
  if (apiKey.length <= 8) {
    return '********'
  }

  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
}

const run = async (): Promise<void> => {
  const apiKey = readGeminiApiKey()
  const client = createGeminiClient()
  const model = client.getGenerativeModel({ model: GEMINI_MODEL })

  const response = await model.generateContent('Reply with exactly OK.')
  const text = response.response.text().trim()

  console.log(`[Gemini Test] Model: ${GEMINI_MODEL}`)
  console.log(`[Gemini Test] API key from env: ${maskApiKey(apiKey)}`)
  console.log(`[Gemini Test] Response: ${text}`)
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`[Gemini Test] Failed: ${message}`)
  process.exitCode = 1
})
