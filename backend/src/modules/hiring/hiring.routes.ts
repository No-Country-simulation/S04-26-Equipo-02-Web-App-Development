import { Router } from 'express';

import * as HiringController from './hiring.controller';

import { refreshToken } from '../../middlewares/refresh.token.middleware';
import { tokenMiddleware } from '../../middlewares/token.middleware';

const router = Router();

router.post('/create-offer', refreshToken, tokenMiddleware, HiringController.createOffer);

router.patch('/update-offer', refreshToken, tokenMiddleware, HiringController.updateOffer);

router.delete('/delete-offer/:id', refreshToken, tokenMiddleware, HiringController.deleteOffer);

router.get('/offers', refreshToken, tokenMiddleware, HiringController.getOffers);

router.get('/opportunities', refreshToken, tokenMiddleware, HiringController.getOpportunities);

router.get('/search-candidates', refreshToken, tokenMiddleware, HiringController.searchCandidates);

router.post('/preselection', refreshToken, tokenMiddleware, HiringController.preselectionController);

export default router;