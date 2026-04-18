import { Router } from 'express';
import multer from 'multer';
import { getApplicantsByJob, ingestProfile, ingestCSV } from '../controllers/applicantController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/profile', ingestProfile);
router.post('/upload', upload.single('file'), ingestCSV);
router.get('/:jobId', getApplicantsByJob);

export default router;
