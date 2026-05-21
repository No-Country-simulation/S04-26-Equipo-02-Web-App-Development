import { Request, Response, NextFunction } from 'express';
import * as HiringService from './hiring.service';
import { searchCandidatesSchema, createOfferSchema, updateOfferSchema } from './hiring.schema';

export const searchCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = (req as any).user;

        if (!user || user.role !== "COMPANY") {
            res.status(403).json({ message: "You are not authorized to search candidates" });
            return;
        }

        const query = searchCandidatesSchema.parse(req.query);

        const candidates = await HiringService.searchCandidatesService(query);

        res.json(candidates);

    } catch (error) {
        next(error);
    }
}

export const createOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = createOfferSchema.parse(req.body);

        const user = (req as any).user;

        if (!user || user.role !== "COMPANY") {
            res.status(403).json({ message: "You are not authorized to create an offer" });
            return;
        }

        const offer = await HiringService.createOfferService(user.userId, parsed);

        res.json(offer);

    } catch (error) {
        next(error);
    }
}

export const updateOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const parsed = updateOfferSchema.parse(req.body);

        const user = (req as any).user;

        if (!user || user.role !== "COMPANY") {
            res.status(403).json({ message: "You are not authorized to update an offer" });
            return;
        }

        const offer = await HiringService.updateOfferService(user.userId, parsed);

        res.json(offer);

    } catch (error) {
        next(error);
    }
}