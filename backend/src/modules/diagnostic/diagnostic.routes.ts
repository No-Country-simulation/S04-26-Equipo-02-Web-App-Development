import { Router } from 'express';
import * as DiagnosticController from './diagnostic.controller';
import { tokenMiddleware, authorize } from '../../middlewares/token.middlewares';

const router = Router();

// GET /api/v1/diagnostic/skills
router.get('/skills', DiagnosticController.getSkills);

// POST /api/v1/diagnostic/submit
router.post('/submit', tokenMiddleware, authorize(['PROFESSIONAL']), DiagnosticController.submitDiagnostic);

export default router;
