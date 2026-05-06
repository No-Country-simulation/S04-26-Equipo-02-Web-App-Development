import { generatePassword } from 'password-generator';

export const generateId = () => {
    const id = generatePassword(
        8,
        false,
        /\d/
    );

    return id.toString();
};