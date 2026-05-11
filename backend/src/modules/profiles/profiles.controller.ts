import { Request, Response, NextFunction } from 'express';
import * as ProfileService from './profiles.service';
import { updateProfileSchema } from './profiles.schema';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId; 
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
    const userId = req.user?.userId;
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
