import { prisma } from '../../utils/prisma';
import { Role } from '@prisma/client';
import { generateAdminPassword } from '../../utils/generate.password.admin';
import { sendEmail } from '../../config/nodemailer';

export const createAdminService = async (email: string) => {

    const checkEmail = await prisma.user.findUnique({
        where: {
            email,
            role: Role.ADMIN
        }
    });

    if(checkEmail) {
        throw new Error("El correo electrónico ya está registrado");
    }

    const { password, passwordHash } = await generateAdminPassword();

    await prisma.user.create({
        data: {
            email,
            passwordHash: passwordHash,
            role: Role.ADMIN,
            isActive: true
        }
    });

    sendEmail({
        to: email,
        subject: "Cuenta de administrador creada",
        html: `<p>Se ha creado una cuenta de administrador para usted. Su contraseña temporal es: <strong>${password}</strong>. Por favor, cambie su contraseña después de iniciar sesión.</p>`
    });

    return 'Administrador creado exitosamente';

}

export const getAllUsersService = async ({ role, email, id }: { role?: Role; email?: string; id: string }) => {

    const users = await prisma.user.findMany({
        where: {
            ...(role ? { role } : {}),
            ...(email ? { email: { contains: email, mode: 'insensitive' } } : {}),
            id: {
                not: id
            }
        }
    });

    return users;
}