import dotenv from 'dotenv'

dotenv.config()

const run = async (): Promise<void> => {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('API key missing')

  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash-exp', 'gemini-3.1-flash-lite']
  
  for (const model of models) {
    console.log(`Testing model: ${model}...`)
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say OK' }] }]
        })
      })

      if (response.ok) {
        const data = await response.json() as any
        console.log(`  [SUCCESS] ${model}: ${data.candidates[0].content.parts[0].text}`)
        return // Stop at first success
      } else {
        const error = await response.json() as any
        console.log(`  [FAILED] ${model}: ${error.error?.message || response.statusText}`)
      }
    } catch (e: any) {
      console.log(`  [ERROR] ${model}: ${e.message}`)
    }
  }
}

run().catch(console.error)
