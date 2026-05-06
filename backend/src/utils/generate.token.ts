import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: object) => {
    const secret = process.env.JWT_SECRET || '123456789';

    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "15m",
    };

    return jwt.sign(payload, secret, options);
};

export const generateRefreshTokenJwt = (payload: object) => {
    const secret = process.env.JWT_REFRESH_SECRET || '987654321';

    const options: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) || "30d",
    };

    return jwt.sign(payload, secret, options);
};