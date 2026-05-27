import { Request, Response, NextFunction } from 'express';
import { createAdminSchema, queryAdminSchema } from './admin.schema';
import * as adminService from './admin.service';

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {

    try {
    
        const user = (req as any).user;

        if (!user || user.role !== "ADMIN") {
            res.status(403).json({ message: "You are not authorized to create admins" });
            return;
        }

        const { email } = createAdminSchema.parse(req.body);

        const response = await adminService.createAdminService(email);

        res.status(200).json({
            message: response
        });

    } catch (error) {
        next(error);
    }

}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = (req as any).user;

        if (!user || user.role !== "ADMIN") {
            res.status(403).json({ message: "You are not authorized to create admins" });
            return;
        }

        const query = queryAdminSchema.parse(req.query);

        const response = await adminService.getAllUsersService({ ...query, id: user.userId });

        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}