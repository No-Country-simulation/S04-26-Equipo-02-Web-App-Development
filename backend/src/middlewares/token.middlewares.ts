import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { validateToken } from '../utils/validate.token'
import { prisma } from '../utils/prisma';

export const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No estás autorizado (falta token)" });
    }

    try {
        const decoded = validateToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Token inválido" });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.isActive === false) {
            return res.status(401).json({ message: "Usuario deshabilitado" });
        }

        req.user = { userId: user.id, role: user.role, email: user.email };

        next();

    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

export const authorize = (roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                data: null,
                error: 'No tenés permisos para realizar esta acción',
            });
        }

        return next();
    };
};
