import { Router } from 'express';
import * as DiagnosticController from './diagnostic.controller';
import { tokenMiddleware, authorize } from '../../middlewares/token.middleware';

const router = Router();

// GET /api/v1/diagnostic/skills
router.get('/skills', DiagnosticController.getSkills);

// POST /api/v1/diagnostic/submit
router.post('/submit', tokenMiddleware, authorize(['PROFESSIONAL']), DiagnosticController.submitDiagnostic);

// GET /api/v1/diagnostic
router.get('/', tokenMiddleware, authorize(['PROFESSIONAL']), DiagnosticController.getDiagnosticStatus);

export default router;

