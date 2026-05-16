import { Request, Response, NextFunction } from 'express';
import * as ProfileService from './profiles.service';
import { updateProfileSchema, experienceSchema, languageSchema, educationSchema, certificationSchema } from './profiles.schema';

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

export const addLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = languageSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const language = await ProfileService.addLanguage(userId, validatedData);

    res.status(201).json({
      success: true,
      data: language,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const removeLanguage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    if (!id) throw new Error('LANGUAGE_ID_REQUIRED');

    await ProfileService.deleteLanguage(userId, id as string);

    res.json({
      success: true,
      data: { message: 'Idioma eliminado correctamente' },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const addEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = educationSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const education = await ProfileService.addEducation(userId, validatedData);

    res.status(201).json({
      success: true,
      data: education,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const removeEducation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    if (!id) throw new Error('EDUCATION_ID_REQUIRED');

    await ProfileService.deleteEducation(userId, id as string);

    res.json({
      success: true,
      data: { message: 'Formación eliminada correctamente' },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const addCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = certificationSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    const certification = await ProfileService.addCertification(userId, validatedData);

    res.status(201).json({
      success: true,
      data: certification,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    if (!userId) throw new Error('UNAUTHORIZED');

    if (!id) throw new Error('CERTIFICATION_ID_REQUIRED');

    await ProfileService.deleteCertification(userId, id as string);

    res.json({
      success: true,
      data: { message: 'Certificación eliminada correctamente' },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
