import express from 'express'
import cors, { type CorsOptions } from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
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

/** Normalizes origin for safer comparisons. */
const normalizeOrigin = (value: string): string =>
  value.trim().replace(/\/$/, '').toLowerCase()

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

const isTrustedVercelOrigin = (origin: string): boolean => {
  // Allow production + preview deployments for this frontend on Vercel.
  return /^https:\/\/proofhire-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(
    origin
  )
}

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true // allow server-to-server / curl requests
  const normalized = normalizeOrigin(origin)
  if (isTrustedVercelOrigin(normalized)) return true
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

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (isOriginAllowed(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin)
      res.header('Vary', 'Origin')
    }

    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] ??
        'Content-Type, Authorization'
    )
  }

  if (req.method === 'OPTIONS') {
    if (isOriginAllowed(origin)) {
      return res.sendStatus(200)
    }

    return res.status(403).json({
      success: false,
      message: `CORS policy: origin "${origin}" is not allowed`,
    })
  }

  next()
})

app.use(cors(corsOptions))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check route (obligatoire pour Railway)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ProofHire API is running',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
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
  app.listen(PORT, () => {
    console.log(`[ProofHire] Backend running on port ${PORT}`)
    console.log(
      `[ProofHire] Environment: ${process.env.NODE_ENV || 'development'}`
    )
  })

  try {
    await connectDB()
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error)
  }
}

startServer()

export default app
