import { Request, Response, NextFunction } from 'express';
import * as AuthServices from './auth.service';
import { loginSchema, registerSchema, validateEmailSchema } from './auth.schema';
import { Role } from "@prisma/client";

export const loginController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { email, password, provider } = loginSchema.parse(req.body);

        const responseService = await AuthServices.loginService(email, password, provider);

        const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';

        res.cookie('token', responseService.token, {
            httpOnly: true,
            secure: isSecure,
            sameSite: isSecure ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', responseService.refreshToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: isSecure ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login exitoso"
        });

    } catch (error) {
        next(error);
    }

}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const { email, password, provider, firstName, lastName, location, phone } = registerSchema.parse(req.body);

        if (provider === Role.ADMIN) {
            res.status(403).json({
                message: 'No se permite registrar usuarios con rol ADMIN'
            });
            return;
        }

        const responseService = await AuthServices.registerService(email, password, provider, firstName, lastName, location, phone);

        res.status(200).json({
            message: responseService
        });

    } catch (error) {
        next(error);
    }

}

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {

    const { token } = validateEmailSchema.parse(req.params);
    const sanitizedToken = decodeURIComponent(token).trim();

    if (!sanitizedToken) {
        res.status(400).json({
            message: "Token inválido"
        });
        return;
    }

    try {

        const result = await AuthServices.verifyEmailService(sanitizedToken);

        res.status(200).json({
            message: result
        });

    } catch (error) {
        next(error);
    }

}

export const validateSessionController = async (_req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "Sesión válida"
    });
    next();
}

export const logoutController = async (_req: Request, res: Response, next: NextFunction) => {

    const refreshToken = _req.cookies.refreshToken;

    try {

        const responseService = await AuthServices.logoutService(refreshToken);

        res.clearCookie('token');
        res.clearCookie('refreshToken');

        res.status(200).json({
            message: responseService
        });

    } catch (error) {
        next(error);
    }
}