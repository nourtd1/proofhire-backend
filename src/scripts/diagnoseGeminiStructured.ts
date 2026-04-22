import dotenv from 'dotenv'
import { SchemaType, type Schema } from '@google/generative-ai'
import { createGeminiClient, GEMINI_MODEL, generateContentWithRetry } from '../services/geminiClient'

dotenv.config()

const simpleSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    answer: { type: SchemaType.STRING },
  },
  required: ['answer'],
}

const run = async (): Promise<void> => {
  const client = createGeminiClient()
  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: simpleSchema,
    },
  })

  try {
    const result = await generateContentWithRetry(model, {
      contents: [{ role: 'user', parts: [{ text: 'Return {"answer":"OK"} and nothing else.' }] }],
    })

    console.log('[Structured Test] Raw text:', result.response.text())
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('[Structured Test] Error message:', error.message)
      console.error('[Structured Test] Error name:', error.name)
    } else {
      console.error('[Structured Test] Unknown error:', String(error))
    }

    process.exitCode = 1
  }
}

run()
