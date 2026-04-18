import { Router } from 'express'
import { generateTest, submitTest, getTestByApplicant } from '../controllers/testController'

const router = Router()

router.post('/generate', generateTest)
router.post('/submit', submitTest)
router.get('/:applicantId', getTestByApplicant)

export default router

