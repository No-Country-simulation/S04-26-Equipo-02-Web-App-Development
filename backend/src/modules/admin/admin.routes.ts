import { Router } from 'express';
import * as AdminRoutes from './admin.controller';

import { refreshToken } from '../../middlewares/refresh.token.middleware';
import { tokenMiddleware } from '../../middlewares/token.middleware';

const router = Router();

router.post('/create', tokenMiddleware, refreshToken, AdminRoutes.createAdmin);

router.get('/users', tokenMiddleware, refreshToken, AdminRoutes.getAllUsers);

export default router;