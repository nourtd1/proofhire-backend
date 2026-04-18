import mongoose, { Schema, Document } from 'mongoose';
import { TalentProfile } from '../types/profile';

export interface IApplicant extends Document {
  jobId: mongoose.Types.ObjectId;
  profile: TalentProfile;
  isVerified: boolean;
  resumeText?: string;
  source: 'platform' | 'upload';
  createdAt: Date;
}

const ApplicantSchema = new Schema<IApplicant>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  profile: { type: Schema.Types.Mixed, required: true },
  isVerified: { type: Boolean, default: false },
  resumeText: { type: String },
  source: { type: String, enum: ['platform', 'upload'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IApplicant>('Applicant', ApplicantSchema);
