import { validateToken } from '../utils/validate.token'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tokenMiddleware = async (req: any, res: any, next: any) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No estás autorizado (falta token)" });
    }

    try {

        const decoded = validateToken(token);

        if(!decoded) {
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
        return res.status(401).json({ message: "Token inválido by token" });
    }
};
