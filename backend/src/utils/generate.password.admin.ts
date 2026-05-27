import { generatePassword } from 'password-generator';
import { hashPassword } from './hash.password';

export const generateAdminPassword = async () => {
    const password = generatePassword(
        20,
        false,
        /[\w\d!@#$%]/
    );

    const refactoredPassword = password.toString();

    const passwordHash = await hashPassword(refactoredPassword);

    return { password: refactoredPassword, passwordHash };
};