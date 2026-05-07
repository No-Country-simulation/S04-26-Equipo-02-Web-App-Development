import { validateRefreshToken } from "../utils/validate.token";
import { PrismaClient } from "@prisma/client";
import { hashRefreshToken } from "../utils/hash.refresh.token";

const prisma = new PrismaClient();

export const refreshToken = async (req: any, res: any, next: any) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No estás autorizado (falta refreshToken)" });
    }

    try {

        const decode = validateRefreshToken(refreshToken);

        if (!decode) {
            return res.status(401).json({ message: "Refresh token inválido" });
        }

        const refreshTokenHash = hashRefreshToken(decode.refreshToken);

        const session = await prisma.userSession.findUnique({

            where: {
                id: decode.refreshTokenId,
                refreshTokenHash: refreshTokenHash,
                revoked: false,
            }

        })

        if (!session) {
            return res.status(401).json({ message: "Sesión inválida o expirada by refresh token" });
        }

        if (new Date(session.expiresAt) < new Date()) {
            await prisma.userSession.delete({ where: { id: session.id } })
            return res.status(401).json({ message: "Sesión inválida o expirada by refresh token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado by refresh token" });
        }

        if(user.id !== decode.userId) {
            return res.status(401).json({ message: "Usuario no autorizado by refresh token" });
        }

        next();

    } catch (error) {
        console.error("Error en refreshToken:", error);
        return res.status(500).json({ message: "Error interno del servidor by refresh token" });
    }

}