import { Request, Response, NextFunction } from 'express';
import * as ProfileService from './profiles.service';
import { updateProfileSchema, experienceSchema } from './profiles.schema';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId; 
    if (!userId) throw new Error('UNAUTHORIZED');
    
    const profile = await ProfileService.getProfileByUserId(userId);
    
    res.json({
      success: true,
      data: profile,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');
    
    const updatedProfile = await ProfileService.updateProfile(userId, validatedData);
    
    res.json({
      success: true,
      data: updatedProfile,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const addExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = experienceSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const experience = await ProfileService.addExperience(userId, validatedData);

    res.status(201).json({
      success: true,
      data: experience,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const removeExperience = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    if (!id) throw new Error('EXPERIENCE_ID_REQUIRED');

    await ProfileService.deleteExperience(userId, id as string);

    res.json({
      success: true,
      data: { message: 'Experiencia eliminada correctamente' },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
