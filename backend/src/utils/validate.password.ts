import bcrypt from "bcryptjs";

export const validatePassword = async (password: string, dbPassword: string) => {
    return bcrypt.compare(password, dbPassword);
};