import { PrismaClient } from "@prisma/client";
import { validatePassword } from "../utils/validate.password";
import { generateId } from "../utils/generate.id";
import { generateToken, generateRefreshTokenJwt } from "../utils/generate.token";
import { generateRefreshToken } from "../utils/generate.refresh.token";
import { hashPassword } from "../utils/hash.password";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();

export const loginService = async (email: string, password: string, provider: string) => {

    const checkUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!checkUser) {
        throw new Error('USER_NOT_FOUND');
    }

    if(checkUser.isActive === false) {
        throw new Error('USER_INACTIVE');
    }

    if(checkUser.role !== provider) {
        throw new Error('PROVIDER_MISMATCH');
    }

    const passwordCheck = await validatePassword(password, checkUser.passwordHash);

    if (!passwordCheck) {
        throw new Error('INVALID_PASSWORD');
    }

    const idRefreshToken = await generateId();

    console.log('ID Refresh Token generado:', idRefreshToken);

    const { refreshToken, hashed } = generateRefreshToken();

    await prisma.userSession.create({
        data: {
            id: idRefreshToken,
            refreshTokenHash: hashed,
            userId: checkUser.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false,
        }
    });

    const refreshTokenJWT = generateRefreshTokenJwt({ userId: checkUser.id, refreshTokenId: idRefreshToken, refreshToken: refreshToken });

    const token = generateToken({ userId: checkUser.id, email: checkUser.email, role: checkUser.role });

    return { token, refreshToken: refreshTokenJWT };

}

export const registerService = async (email: string, password: string, provider: Role, firstName: string, lastName: string, location: string, phone: string) => {

    const checkUser = await prisma.user.findUnique({
        where: {
            email,
            role: provider
        }
    });

    if (checkUser) {
        throw new Error('USER_ALREADY_EXISTS');
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
        data: {
            email,
            passwordHash,
            role: provider,
            isActive: true
        }
    });

    const newUser = await prisma.user.findUnique({
        where: {
            email,
            role: provider
        }
    });

    if(provider === Role.PROFESSIONAL) {
        await prisma.professionalProfile.create({
            data: {
                firstName,
                lastName,
                location,
                phone,
                slug: `${firstName}-${lastName}`,
                user: {
                    connect: {
                        id: newUser?.id
                    }
                }
            }
        })
    }

    return 'Registro exitoso';

}