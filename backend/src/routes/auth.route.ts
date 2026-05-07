import { Router } from 'express';

const router = Router();

import {

    loginController,
    registerController,
    verifyEmailController,
    validateSessionController

} from '../controllers/auth.controller';

import { refreshToken } from '../middlewares/refresh.token';
import { tokenMiddleware } from '../middlewares/token.middlewares';

router.post("/login", loginController);

router.post("/register", registerController);

router.patch("/verify-email/:token", verifyEmailController);

router.get("/validate-session", refreshToken, tokenMiddleware, validateSessionController);

export default router;