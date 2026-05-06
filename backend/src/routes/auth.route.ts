import { Router } from 'express';

const router = Router();

import {

    loginController

} from '../controllers/auth.controller';

router.post("/login", loginController)

export default router;