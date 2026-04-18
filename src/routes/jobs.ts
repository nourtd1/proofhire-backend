import { Router } from 'express';
import { getAllJobs, createJob, getJobById, deleteJob } from '../controllers/jobController';

const router = Router();

router.get('/', getAllJobs);
router.post('/', createJob);
router.get('/:id', getJobById);
router.delete('/:id', deleteJob);

export default router;
