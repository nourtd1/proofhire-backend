import { Request, Response } from 'express';
import Job, { IJob } from '../models/Job';

type SuccessResponse<T> = { success: true; data: T };
type SuccessMessageResponse = { success: true; message: string };
type ErrorResponse = { success: false; message: string };

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';

// GET /api/jobs
// Returns all jobs sorted by createdAt descending
export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs: IJob[] = await Job.find().sort({ createdAt: -1 });
    const payload: SuccessResponse<IJob[]> = { success: true, data: jobs };
    res.json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(500).json(payload);
  }
};

// POST /api/jobs
// Creates a new job from req.body
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as unknown;
    const title = typeof (body as { title?: unknown }).title === 'string' ? (body as { title: string }).title : '';
    const description =
      typeof (body as { description?: unknown }).description === 'string'
        ? (body as { description: string }).description
        : '';

    if (!title.trim() || !description.trim()) {
      const payload: ErrorResponse = {
        success: false,
        message: 'Title and description are required',
      };
      res.status(400).json(payload);
      return;
    }

    const job = new Job(body);
    const saved: IJob = await job.save();
    const payload: SuccessResponse<IJob> = { success: true, data: saved };
    res.status(201).json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(400).json(payload);
  }
};

// GET /api/jobs/:id
// Returns a single job by MongoDB ObjectId
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job: IJob | null = await Job.findById(req.params.id);
    if (!job) {
      const payload: ErrorResponse = { success: false, message: 'Job not found' };
      res.status(404).json(payload);
      return;
    }
    const payload: SuccessResponse<IJob> = { success: true, data: job };
    res.json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(500).json(payload);
  }
};

// DELETE /api/jobs/:id
// Deletes a job by MongoDB ObjectId
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted: IJob | null = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) {
      const payload: ErrorResponse = { success: false, message: 'Job not found' };
      res.status(404).json(payload);
      return;
    }
    const payload: SuccessMessageResponse = {
      success: true,
      message: 'Job deleted successfully',
    };
    res.json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(500).json(payload);
  }
};

// Back-compat exports (existing routes previously referenced these names)
export const getJobs = getAllJobs;

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  const payload: ErrorResponse = { success: false, message: 'Not implemented' };
  res.status(501).json(payload);
};
