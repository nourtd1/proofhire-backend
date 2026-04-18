import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'

// Routes
import jobRoutes from './routes/jobs'
import applicantRoutes from './routes/applicants'
import screeningRoutes from './routes/screening'
import testRoutes from './routes/tests'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

/** Compare les origins sans slash final (évite les rejets si FRONTEND_URL a un `/` en trop). */
const normalizeOrigin = (value: string): string => value.trim().replace(/\/$/, '')

// CORS: localhost + une ou plusieurs URLs (FRONTEND_URL peut être liste séparée par des virgules)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((s) => normalizeOrigin(s))
    .filter(Boolean),
]

const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return true
  const n = normalizeOrigin(origin)
  return allowedOrigins.some((o) => o === n || o === origin)
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        console.error('[CORS] Blocked origin:', origin, '| allowed:', allowedOrigins)
        callback(new Error(`CORS: origin ${origin} not allowed`))
      }
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check route (obligatoire pour Railway)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ProofHire API is running',
    timestamp: new Date().toISOString(),
  })
})

// Monter toutes les routes
app.use('/api/jobs', jobRoutes)
app.use('/api/applicants', applicantRoutes)
app.use('/api/screening', screeningRoutes)
app.use('/api/tests', testRoutes)

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('[Global Error]', err.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
)

// Démarrer le serveur
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`[ProofHire] Backend running on port ${PORT}`)
    console.log(
      `[ProofHire] Environment: ${process.env.NODE_ENV || 'development'}`
    )
  })
}

startServer()

export default app
