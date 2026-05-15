import { Router } from 'express';
import * as ProfileController from './profiles.controller';
import { tokenMiddleware } from '../../middlewares/token.middleware';

const router = Router();

// GET /api/v1/profiles/me
router.get('/me', tokenMiddleware, ProfileController.getMyProfile);

// PATCH /api/v1/profiles/update
router.patch('/update', tokenMiddleware, ProfileController.updateMyProfile);

// Experiencia Laboral
router.post('/experience', tokenMiddleware, ProfileController.addExperience);
router.delete('/experience/:id', tokenMiddleware, ProfileController.removeExperience);

// Idiomas
router.post('/languages', tokenMiddleware, ProfileController.addLanguage);
router.delete('/languages/:id', tokenMiddleware, ProfileController.removeLanguage);

export default router;
