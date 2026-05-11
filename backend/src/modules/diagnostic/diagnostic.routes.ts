import { Router } from 'express';
import * as DiagnosticController from './diagnostic.controller';
import { tokenMiddleware, authorize } from '../../middlewares/token.middleware';

const router = Router();

// POST /api/v1/diagnostic/submit
router.post('/submit', tokenMiddleware, authorize(['PROFESSIONAL']), DiagnosticController.submitDiagnostic);

export default router;
