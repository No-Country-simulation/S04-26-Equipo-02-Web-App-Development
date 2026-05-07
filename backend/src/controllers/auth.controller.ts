import { z } from 'zod';
import { Request, Response } from "express";
import { 
    loginService,
    registerService,
    verifyEmailService
} from '../services/auth.service';
import { Role } from "@prisma/client";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    provider: z.string()
});

type LoginBody = z.infer<typeof loginSchema>;

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    provider: z.nativeEnum(Role),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    location: z.string().min(1),
    phone: z.string().min(1)
});

type RegisterBody = z.infer<typeof registerSchema>;

export const loginController = async (req: Request<{}, {}, LoginBody>, res: Response) => {

    try {

        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Datos de login inválidos',
                errors: result.error.flatten()
            });
        }

        const { email, password, provider } = result.data;

        const responseService = await loginService(email, password, provider);

        res.cookie('token', responseService.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('refreshToken', responseService.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login exitoso"
        });


    } catch (error) {

        if (error instanceof Error) {

            if(error.message === 'USER_NOT_FOUND' || error.message === 'PROVIDER_MISMATCH') {
                return res.status(404).json({
                    message: 'Usuario no encontrado'
                });
            }

            if(error.message === 'USER_INACTIVE') {
                return res.status(404).json({
                    message: 'Usuario no verificado'
                });
            }

            if(error.message === 'INVALID_PASSWORD') {
                return res.status(401).json({
                    message: 'Contraseña incorrecta'
                });
            }

        }

        return res.status(400).json({
            message: 'Datos de login inválidos: ' + error
        });
    }

}

export const registerController = async (req: Request<{}, {}, RegisterBody>, res: Response) => {

    try{
        
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Datos de registro inválidos',
                errors: result.error.flatten()
            });
        }

        const { email, password, provider, firstName, lastName, location, phone } = result.data;

        const responseService = await registerService(email, password, provider, firstName, lastName, location, phone);

        return res.status(200).json({
            message: responseService
        });

    } catch (error) {
        return res.status(400).json({
            message: 'Datos de registro inválidos: ' + error
        });
    }

}

export const verifyEmailController = async (req: Request<{ token: string }>, res: Response) => {

    const { token } = req.params;
    const sanitizedToken = decodeURIComponent(token).trim();

    if (!sanitizedToken) {
        return res.status(400).json({
            message: "Token inválido"
        });
    }

    try {

        const result = await verifyEmailService(sanitizedToken);

        return res.status(200).json({
            message: result
        });

    } catch (error) {

        if (error instanceof Error) {
            if (error.message === 'INVALID_TOKEN') {
                return res.status(400).json({
                    message: "Token inválido o expirado"
                });
            }
            if (error.message === 'USER_NOT_FOUND') {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }
            if (error.message === 'USER_ALREADY_VERIFIED') {
                return res.status(400).json({
                    message: "Email ya verificado"
                });
            }
        }

        return res.status(400).json({
            message: "Error al verificar el email" + error
        });

    }

}

export const validateSessionController = async (_req: Request, res: Response) => {
    res.status(200).json({
        message: "Sesión válida"
    });
}