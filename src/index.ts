import express from 'express'
import cors, { type CorsOptions } from 'cors'
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

// ─── CORS ────────────────────────────────────────────────────────────────────

/** Removes trailing slash for consistent origin comparison. */
const normalizeOrigin = (value: string): string => value.trim().replace(/\/$/, '')

/**
 * Base whitelist — always includes the Vercel production frontend.
 * Additional origins can be injected via FRONTEND_URL (comma-separated).
 */
const PRODUCTION_ORIGINS: readonly string[] = [
  'https://proofhire-frontend-ap.vercel.app',
]

const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...PRODUCTION_ORIGINS,
  ...(process.env.FRONTEND_URL ?? '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean),
]

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true // allow server-to-server / curl requests
  const normalized = normalizeOrigin(origin)
  return allowedOrigins.some((allowed) => normalizeOrigin(allowed) === normalized)
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true)
    } else {
      console.error('[CORS] Blocked origin:', origin, '| Allowed:', allowedOrigins)
      callback(new Error(`CORS policy: origin "${origin}" is not allowed`))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] satisfies string[],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
}

// Handle pre-flight requests for all routes
app.options('*', cors(corsOptions))
app.use(cors(corsOptions))

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
