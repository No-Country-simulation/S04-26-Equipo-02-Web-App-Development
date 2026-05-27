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

export const toggleUserService = async (id: string, currentUserId: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    if(user.id === currentUserId) {
        throw new Error("No puedes desactivar tu propia cuenta");
    }

    await prisma.user.update({
        where: {
            id
        },
        data: {
            isActive: !user.isActive
        }
    });

    sendEmail({
        to: user.email,
        subject: "Estado de cuenta actualizado",
        html: `<p>Tu cuenta ha sido ${user.isActive ? 'desactivada' : 'activada'} por un administrador. Si tienes alguna pregunta, por favor contacta al soporte.</p>`
    });

    return `La cuenta del usuario ha sido ${user.isActive ? 'desactivada' : 'activada'} exitosamente`;
}