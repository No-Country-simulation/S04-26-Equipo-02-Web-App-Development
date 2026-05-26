import { Request, Response, NextFunction } from 'express';
import * as DiagnosticService from './diagnostic.service';
import { diagnosticAnswersSchema } from './diagnostic.schema';

export const getSkills = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await DiagnosticService.getAllSkills();
    res.json({
      success: true,
      data: skills,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const submitDiagnostic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answers } = diagnosticAnswersSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const results = await DiagnosticService.processDiagnosticResults(userId, answers);

    res.status(201).json({
      success: true,
      data: results,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiagnosticStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const status = await DiagnosticService.getDiagnosticStatus(userId);

    res.json({
      success: true,
      data: status,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

