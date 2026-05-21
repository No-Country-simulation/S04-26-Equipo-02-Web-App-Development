import { Router } from 'express';

import * as HiringController from './hiring.controller';

const router = Router();

router.get('/search-candidates', HiringController.searchCandidates);

export default router;