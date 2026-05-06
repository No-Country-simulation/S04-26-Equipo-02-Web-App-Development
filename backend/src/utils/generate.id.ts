import { generatePassword } from 'password-generator';

export const generateId = async () => {
    const id = await generatePassword(
        20,
        false,
        /\d/
    );

    return id.toString();
};