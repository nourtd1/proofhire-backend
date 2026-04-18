import mongoose, { Schema, Document } from 'mongoose';

export interface IScreeningResult extends Document {
  jobId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  matchScore: number;
  strengths: string[];
  gaps: string[];
  recommendation: 'Hire' | 'Maybe' | 'Pass';
  reasoning: string;
  rank: number;
  createdAt: Date;
}

const ScreeningResultSchema = new Schema<IScreeningResult>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
  matchScore: { type: Number, required: true, min: 0, max: 100 },
  strengths: [{ type: String }],
  gaps: [{ type: String }],
  recommendation: { type: String, enum: ['Hire', 'Maybe', 'Pass'], required: true },
  reasoning: { type: String, required: true },
  rank: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IScreeningResult>('ScreeningResult', ScreeningResultSchema);
