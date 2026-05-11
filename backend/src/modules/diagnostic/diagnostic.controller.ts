import { Request, Response, NextFunction } from 'express';
import * as DiagnosticService from './diagnostic.service';
import { diagnosticAnswersSchema } from './diagnostic.schema';

export const submitDiagnostic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answers } = diagnosticAnswersSchema.parse(req.body);
    const userId = req.user?.userId;
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
