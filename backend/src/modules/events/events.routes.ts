import { Router } from 'express';

import * as EventsController from './events.controller';

import { refreshToken } from '../../middlewares/refresh.token.middleware';
import { tokenMiddleware } from '../../middlewares/token.middleware';

const router = Router();

router.get("/get-all", tokenMiddleware, refreshToken, EventsController.getAll);

router.post("/enroll/:id", tokenMiddleware, refreshToken, EventsController.enrollUser);

router.post("/unenroll/:id", tokenMiddleware, refreshToken, EventsController.unenrollUser);

router.post("/create", tokenMiddleware, refreshToken, EventsController.createEvent);

export default router;