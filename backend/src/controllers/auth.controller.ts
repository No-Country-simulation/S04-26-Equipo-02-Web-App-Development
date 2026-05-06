import { z } from 'zod';
import { Request, Response } from "express";
import { 
    loginService
} from '../services/auth.service';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    provider: z.string()
});

type LoginBody = z.infer<typeof loginSchema>;

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
                    message: 'Usuario no activo'
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