import {sign,verify} from 'hono/jwt';

type TokenPayload = {
    userId: string;
    username: string;
    iat?: number;
    exp?: number; 
};

export const createToken = async (payload: TokenPayload, secret: string, options?: object): Promise<string> => {
    return await sign(payload, secret);
}

export const verifyToken = async (token: string, secret: string): Promise<TokenPayload | null> => {
    try {
        const payload = await verify(token, secret);
        return payload as TokenPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export const decodeToken = (token: string): TokenPayload | null => {
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return payload as TokenPayload;
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
}

export const isTokenExpired = (token: string): boolean => {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
}

export const getUserIdFromToken = (token: string): string | null => {
    const payload = decodeToken(token);
    return payload ? payload.userId : null;
}

export const getUsernameFromToken = (token: string): string | null => {
    const payload = decodeToken(token);
    return payload ? payload.username : null;
}

export const getTokenExpiration = (token: string): Date | null => {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) return null;
    return new Date(payload.exp * 1000);
}