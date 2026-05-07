import { Router } from 'express';

const router = Router();

import {

    loginController,
    registerController

} from '../controllers/auth.controller';

router.post("/login", loginController);

router.post("/register", registerController);

export default router;