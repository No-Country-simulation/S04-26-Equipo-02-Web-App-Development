import { Request, Response, NextFunction } from 'express';
import * as EventsService from './events.service';
import { enrollUserInEventSchema } from './events.schema';

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {

    try {

        const events = await EventsService.getAllEventsService();

        res.json(events);

    } catch (error) {
        next(error);
    }

}

export const enrollUser = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const user = (req as any).user;

        if (!user || user.role !== "PROFESSIONAL") {
            res.status(403).json({ message: "You are not authorized to enroll in an event" });
            return;
        }

        const { id } = enrollUserInEventSchema.parse(req).params;

        const enrollment = await EventsService.enrollUserInEventService(user.userId, id);

        res.json({ message: enrollment });

    } catch (error) {
        next(error);
    }

}