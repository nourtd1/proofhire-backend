import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job';
import Applicant from '../models/Applicant';
import ScreeningResult, { IScreeningResult } from '../models/ScreeningResult';
import { screenApplicants } from '../services/geminiService';
import type { ApplicantType, JobType, SingleScreeningResult as ServiceResult } from '../types/profile';

type ErrorResponse = { success: false; message: string };
type SuccessResponse<T> = { success: true; message?: string; data: T; count?: number };

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';

// POST /api/screening/run
// Body: { jobId: string }
// Triggers AI screening for all applicants of a job
export const runScreening = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobId = (req.body as { jobId?: unknown }).jobId;
    if (typeof jobId !== 'string' || jobId.trim().length === 0) {
      const payload: ErrorResponse = { success: false, message: 'jobId is required' };
      res.status(400).json(payload);
      return;
    }
    if (!mongoose.isValidObjectId(jobId)) {
      const payload: ErrorResponse = { success: false, message: 'Invalid jobId' };
      res.status(400).json(payload);
      return;
    }

    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) {
      const payload: ErrorResponse = { success: false, message: 'Job not found' };
      res.status(404).json(payload);
      return;
    }

    const applicantsDoc = await Applicant.find({ jobId });
    if (applicantsDoc.length === 0) {
      const payload: ErrorResponse = {
        success: false,
        message: 'No applicants found for this job. Please add applicants first.',
      };
      res.status(400).json(payload);
      return;
    }

    const job = jobDoc as unknown as JobType;
    const applicants = applicantsDoc as unknown as ApplicantType[];

    console.log(
      `[Screening] Starting AI screening for job: ${jobDoc.title} with ${applicantsDoc.length} applicants`
    );

    const results: ServiceResult[] = await screenApplicants(job, applicants);

    for (const result of results) {
      await ScreeningResult.deleteMany({ jobId, applicantId: result.applicantId });

      const doc = new ScreeningResult({
        jobId,
        applicantId: result.applicantId,
        matchScore: result.matchScore,
        strengths: result.strengths,
        gaps: result.gaps,
        recommendation: result.recommendation,
        reasoning: result.reasoning,
        rank: result.rank,
      });
      await doc.save();
    }

    const sorted = results.slice().sort((a, b) => a.rank - b.rank);
    console.log(`[Screening] Completed. Saved ${sorted.length} screening results.`);

    const payload: SuccessResponse<ServiceResult[]> = {
      success: true,
      message: 'Screening completed',
      data: sorted,
      count: sorted.length,
    };
    res.status(200).json(payload);
  } catch (err: unknown) {
    console.error('[Screening Error]', err);
    const message = getErrorMessage(err) || 'Screening failed';
    const payload: ErrorResponse = { success: false, message };
    res.status(500).json(payload);
  }
};

// GET /api/screening/:jobId
// Returns all screening results for a job with applicant profile populated
export const getScreeningResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    if (!mongoose.isValidObjectId(jobId)) {
      const payload: ErrorResponse = { success: false, message: 'Invalid jobId' };
      res.status(400).json(payload);
      return;
    }

    const results: IScreeningResult[] = await ScreeningResult.find({ jobId })
      .populate('applicantId')
      .sort({ rank: 1 });

    const payload: SuccessResponse<IScreeningResult[]> = {
      success: true,
      data: results,
      count: results.length,
    };
    res.json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(500).json(payload);
  }
};
