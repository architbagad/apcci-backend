import { Context } from "hono";
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string, secret: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const combined = password + secret;
    return await bcrypt.hash(combined, salt);
}   

export const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashed);
}