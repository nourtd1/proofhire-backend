import dotenv from 'dotenv'

dotenv.config()

const run = async (): Promise<void> => {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('API key missing')

  const model = 'gemini-1.5-flash'
  console.log(`Testing model: ${model} with v1...`)
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say OK' }] }]
      })
    })

    if (response.ok) {
      const data = await response.json() as any
      console.log(`  [SUCCESS] v1: ${data.candidates[0].content.parts[0].text}`)
    } else {
      const error = await response.json() as any
      console.log(`  [FAILED] v1: ${error.error?.message || response.statusText}`)
    }
  } catch (e: any) {
    console.log(`  [ERROR] v1: ${e.message}`)
  }
}

run().catch(console.error)
