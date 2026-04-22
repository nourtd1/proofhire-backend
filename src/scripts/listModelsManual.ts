import dotenv from 'dotenv'

dotenv.config()

const run = async (): Promise<void> => {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('API key missing')

  console.log(`Listing models for key: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`)
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json() as any
      console.log('Available models:')
      data.models.forEach((m: any) => console.log(`- ${m.name}`))
    } else {
      const error = await response.json() as any
      console.log(`[FAILED] ${error.error?.message || response.statusText}`)
    }
  } catch (e: any) {
    console.log(`[ERROR] ${e.message}`)
  }
}

run().catch(console.error)
