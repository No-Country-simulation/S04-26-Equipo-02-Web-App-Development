import { Request, Response, NextFunction } from 'express';
import * as LearningService from './learning.service';
import { updateProgressSchema } from './learning.schema';
import { CourseStatus } from '@prisma/client';

export const getPaths = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const paths = await LearningService.getLearningPaths();
    res.json({
      success: true,
      data: paths,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const progress = await LearningService.getUserProgress(userId);
    res.json({
      success: true,
      data: progress,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const courseId = req.params.courseId as string;
    if (!courseId) throw new Error('El ID del curso es requerido');

    const { status } = updateProgressSchema.parse(req.body);

    const updated = await LearningService.updateCourseProgress(userId, courseId, status as CourseStatus);
    res.json({
      success: true,
      data: updated,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
