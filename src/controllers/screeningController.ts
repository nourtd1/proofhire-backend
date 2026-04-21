import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job';
import Applicant from '../models/Applicant';
import ScreeningResult, { IScreeningResult } from '../models/ScreeningResult';
import { screenApplicants } from '../services/geminiService';
import { isAIServiceError } from '../services/aiErrorUtils';
import { screenApplicantsWithFallback } from '../services/fallbackScreeningService';
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

    let results: ServiceResult[];
    let completionMessage = 'Screening completed';

    try {
      results = await screenApplicants(job, applicants);
    } catch (err: unknown) {
      if (!isAIServiceError(err)) throw err;

      console.warn(
        `[Screening] Gemini unavailable (${err.code}). Falling back to deterministic scoring.`
      );
      results = screenApplicantsWithFallback(job, applicants, err.code);
      completionMessage = `Screening completed using backup scoring. ${err.userMessage}`;
    }

    await ScreeningResult.deleteMany({ jobId });

    await ScreeningResult.insertMany(
      results.map((result) => ({
        jobId,
        applicantId: result.applicantId,
        matchScore: result.matchScore,
        strengths: result.strengths,
        gaps: result.gaps,
        recommendation: result.recommendation,
        reasoning: result.reasoning,
        rank: result.rank,
      }))
    );

    const populatedResults: IScreeningResult[] = await ScreeningResult.find({ jobId })
      .populate('applicantId')
      .sort({ rank: 1 });
    console.log(`[Screening] Completed. Saved ${populatedResults.length} screening results.`);

    const payload: SuccessResponse<IScreeningResult[]> = {
      success: true,
      message: completionMessage,
      data: populatedResults,
      count: populatedResults.length,
    };
    res.status(200).json(payload);
  } catch (err: unknown) {
    console.error('[Screening Error]', err);
    const message = isAIServiceError(err) ? err.userMessage : getErrorMessage(err) || 'Screening failed';
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
