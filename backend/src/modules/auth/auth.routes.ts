import { Router } from 'express';
import * as AuthRoutes from './auth.controller';

import { refreshToken } from '../../middlewares/refresh.token.middleware';
import { tokenMiddleware } from '../../middlewares/token.middleware';

const router = Router();

router.post("/login", AuthRoutes.loginController);

router.post("/register", AuthRoutes.registerController);

router.patch("/verify-email/:token", AuthRoutes.verifyEmailController);

router.get("/validate-session", refreshToken, tokenMiddleware, AuthRoutes.validateSessionController);

router.patch("/logout", refreshToken, tokenMiddleware, AuthRoutes.logoutController);

export default router;