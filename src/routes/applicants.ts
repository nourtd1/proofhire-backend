import { Router } from 'express';
import multer from 'multer';
import { getApplicantById, getApplicantsByJob, ingestProfile, ingestCSV } from '../controllers/applicantController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/profile', ingestProfile);
router.post('/upload', upload.single('file'), ingestCSV);
router.get('/detail/:applicantId', getApplicantById);
router.get('/:jobId', getApplicantsByJob);

export default router;
