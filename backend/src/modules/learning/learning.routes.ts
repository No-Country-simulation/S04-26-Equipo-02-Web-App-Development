import { Router } from 'express';
import * as LearningController from './learning.controller';
import { tokenMiddleware, authorize } from '../../middlewares/token.middleware';

const router = Router();

router.get('/paths', tokenMiddleware, LearningController.getPaths);
router.get('/progress', tokenMiddleware, authorize(['PROFESSIONAL']), LearningController.getProgress);
router.post('/progress/:courseId', tokenMiddleware, authorize(['PROFESSIONAL']), LearningController.updateProgress);

export default router;
