import { Request, Response } from 'express';
import Applicant, { IApplicant } from '../models/Applicant';
import type { TalentProfile } from '../types/profile';
import csv from 'csv-parser';
import { Readable } from 'stream';

type SuccessResponse<T> = { success: true; data: T };
type ApplicantsByJobResponse = { success: true; data: IApplicant[]; count: number };
type SuccessMessageCountResponse = { success: true; message: string; count: number };
type ErrorResponse = { success: false; message: string };

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

const splitSkillNames = (skills: string): string[] =>
  skills
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

// GET /api/applicants/:jobId
// Returns all applicants for a specific jobId
export const getApplicantsByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicants: IApplicant[] = await Applicant.find({ jobId: req.params.jobId });
    const payload: ApplicantsByJobResponse = {
      success: true,
      data: applicants,
      count: applicants.length,
    };
    res.json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(500).json(payload);
  }
};

// POST /api/applicants/profile
// Body: { jobId: string, profile: TalentProfile }
// Ingests one structured JSON profile
export const ingestProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as unknown;
    const jobId = (body as { jobId?: unknown }).jobId;
    const profile = (body as { profile?: unknown }).profile;

    if (!isNonEmptyString(jobId) || typeof profile !== 'object' || profile === null) {
      const payload: ErrorResponse = { success: false, message: 'jobId and profile are required' };
      res.status(400).json(payload);
      return;
    }

    const applicant = new Applicant({
      jobId,
      profile: profile as TalentProfile,
      source: 'platform',
    });

    const saved: IApplicant = await applicant.save();
    const payload: SuccessResponse<IApplicant> = { success: true, data: saved };
    res.status(201).json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(400).json(payload);
  }
};

interface ApplicantCsvRow {
  firstName?: string;
  lastName?: string;
  email?: string;
  headline?: string;
  location?: string;
  skills?: string;
}

// POST /api/applicants/upload
// Accepts a CSV file via multer (field name: 'file')
// Parses each row and ingests as an Applicant
export const ingestCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const typedReq = req as Request & { file?: Express.Multer.File };

    if (!typedReq.file) {
      const payload: ErrorResponse = { success: false, message: 'CSV file is required' };
      res.status(400).json(payload);
      return;
    }

    const jobIdRaw = (req.body as { jobId?: unknown }).jobId;
    if (!isNonEmptyString(jobIdRaw)) {
      const payload: ErrorResponse = { success: false, message: 'jobId is required' };
      res.status(400).json(payload);
      return;
    }
    const jobId = jobIdRaw;

    const stream = Readable.from(typedReq.file.buffer);

    const savePromises: Promise<void>[] = [];
    let count = 0;

    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row: unknown) => {
          const r = row as ApplicantCsvRow;

          const firstName = isNonEmptyString(r.firstName) ? r.firstName.trim() : '';
          const lastName = isNonEmptyString(r.lastName) ? r.lastName.trim() : '';
          const email = isNonEmptyString(r.email) ? r.email.trim() : '';
          const headline = isNonEmptyString(r.headline) ? r.headline.trim() : '';
          const location = isNonEmptyString(r.location) ? r.location.trim() : '';
          const skillsStr = isNonEmptyString(r.skills) ? r.skills : '';

          const profile: TalentProfile = {
            firstName,
            lastName,
            email,
            headline,
            location,
            bio: '',
            skills: splitSkillNames(skillsStr).map((name) => ({
              name,
              level: 'Intermediate',
              yearsOfExperience: 1,
            })),
            languages: [],
            experience: [],
            education: [],
            certifications: [],
            projects: [],
            availability: { status: 'Available', type: 'Full-time' },
            socialLinks: {},
          };

          const p = new Applicant({
            jobId,
            profile,
            source: 'upload',
          })
            .save()
            .then(() => {
              count += 1;
            })
            .then(() => undefined);

          savePromises.push(p);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (e: unknown) => {
          reject(e);
        });
    });

    // Ensure all saves have completed (ignore per-row failures but don't crash)
    await Promise.allSettled(savePromises);

    const payload: SuccessMessageCountResponse = {
      success: true,
      message: `${count} applicants imported successfully`,
      count,
    };
    res.json(payload);
  } catch (err: unknown) {
    const payload: ErrorResponse = { success: false, message: getErrorMessage(err) };
    res.status(500).json(payload);
  }
};

// Back-compat exports (older routes referenced these)
export const getApplicants = getApplicantsByJob;
export const createApplicant = ingestProfile;

export const getApplicantById = async (req: Request, res: Response): Promise<void> => {
  const payload: ErrorResponse = { success: false, message: 'Not implemented' };
  res.status(501).json(payload);
};
