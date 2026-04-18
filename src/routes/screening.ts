import { Router } from 'express';
import { runScreening, getScreeningResults } from '../controllers/screeningController';

const router = Router();

router.post('/run', runScreening);
router.get('/:jobId', getScreeningResults);

export default router;
