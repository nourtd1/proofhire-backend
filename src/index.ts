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

// CORS: autoriser le frontend Vercel + localhost en dev
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || '', // URL Vercel (à ajouter après déploiement)
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, curl) et les origins autorisées
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
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
