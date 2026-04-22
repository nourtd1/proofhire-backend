import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const run = async (): Promise<void> => {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('API key missing')

  const genAI = new GoogleGenerativeAI(apiKey)
  const models = await genAI.listModels()

  console.log('Available models:')
  for (const model of models.models) {
    console.log(`- ${model.name} (${model.displayName})`)
  }
}

run().catch(console.error)
