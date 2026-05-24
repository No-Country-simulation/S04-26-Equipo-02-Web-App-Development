import { Router } from 'express';
import * as ProfileController from './profiles.controller';
import { tokenMiddleware, authorize } from '../../middlewares/token.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Perfiles de Candidato (Professional)
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

// Educación
router.post('/education', tokenMiddleware, ProfileController.addEducation);
router.delete('/education/:id', tokenMiddleware, ProfileController.removeEducation);

// Certificaciones
router.post('/certifications', tokenMiddleware, ProfileController.addCertification);
router.delete('/certifications/:id', tokenMiddleware, ProfileController.removeCertification);

// Perfiles de Empresa (Company)
// GET /api/v1/profiles/company/me
router.get('/company/me', tokenMiddleware, authorize([Role.COMPANY]), ProfileController.getCompanyProfile);

// PATCH /api/v1/profiles/company/update
router.patch('/company/update', tokenMiddleware, authorize([Role.COMPANY]), ProfileController.updateCompanyProfile);

// Perfil Público por Slug
// GET /api/v1/profiles/slug/:slug
router.get('/slug/:slug', tokenMiddleware, ProfileController.getProfileBySlug);

export default router;
