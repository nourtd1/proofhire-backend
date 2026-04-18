import mongoose, { Schema, Document } from 'mongoose'

export interface TestQuestion {
  id: string // unique id ex: "q1", "q2"...
  question: string // the question asked
  options: string[] // 4 answer options
  correctAnswer: number // index of correct option (0-3)
  skill: string // tested skill e.g. "React"
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface MiniTestDocument extends Document {
  applicantId: mongoose.Types.ObjectId
  jobId: mongoose.Types.ObjectId
  questions: TestQuestion[]
  answers: number[]
  score: number
  passed: boolean
  status: 'pending' | 'in_progress' | 'completed'
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
}

const TestQuestionSchema = new Schema<TestQuestion>(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: unknown): boolean => Array.isArray(v) && v.length === 4 && v.every((x) => typeof x === 'string'),
        message: 'options must be an array of 4 strings',
      },
    },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    skill: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  },
  { _id: false }
)

const MiniTestSchema = new Schema<MiniTestDocument>({
  applicantId: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  questions: { type: [TestQuestionSchema], required: true },
  answers: { type: [Number], required: true, default: [] },
  score: { type: Number, required: true, default: 0, min: 0, max: 100 },
  passed: { type: Boolean, required: true, default: false },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], required: true, default: 'pending' },
  startedAt: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now, required: true },
})

export default mongoose.model<MiniTestDocument>('MiniTest', MiniTestSchema)

