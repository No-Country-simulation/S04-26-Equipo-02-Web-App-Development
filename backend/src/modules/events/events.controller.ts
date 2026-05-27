import { Request, Response, NextFunction } from 'express';
import * as EventsService from './events.service';
import { enrollUserInEventSchema, createEventSchema } from './events.schema';

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

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = (req as any).user;

        if (!user || user.role !== "ADMIN") {
            res.status(403).json({ message: "You are not authorized to create an event" });
            return;
        }

        const { title, type, day, link } = createEventSchema.parse(req.body);

        const event = await EventsService.createEventService(title, type, day, link);

        res.json({ message: event });

    } catch (error) {
        next(error);
    }
}