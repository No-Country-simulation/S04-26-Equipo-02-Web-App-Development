import { Request, Response, NextFunction } from 'express';
import * as HiringService from './hiring.service';

export const searchCandidates = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const query = req.query;

        const candidates = await HiringService.searchCandidatesService(query);

        res.json(candidates);

    } catch (error) {
        next(error);
    }
}