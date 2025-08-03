import { PrismaClient } from "@prisma/client/edge";
import { hashPassword, verifyPassword } from "../utils/hash";
import { createToken,verifyToken } from "../utils/token";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import bcrypt from "bcryptjs";

class Auth {
    private static instance: Auth;

    public static getInstance(): Auth {
        if (!Auth.instance) {
            Auth.instance = new Auth();
        }
        return Auth.instance;
    }
    
    constructor() {}

    public async login(c: Context,username: string, password: string): Promise<any> {

        const prisma = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
          }).$extends(withAccelerate())
        
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) throw new Error("User not found");

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error("Invalid password");

        const accessToken = await createToken({
            userId: user.id,
            username: user.username,
        }, process.env.JWT_SECRET!);

        return {
            token : accessToken,
            user: {
                id: user.id,
                username: user.username,
            },
        };
    }

    public async logout(token: string): Promise<void> {
    
    }

    public async register(c: Context,username: string, password: string): Promise<string> {
        
        const prisma = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const user = await prisma?.user.create({
            data: {
                username,
                password : await bcrypt.hash(password, 10), // Hashing password with secret
            },
        })
        if (!user) throw new Error("User creation failed");
        
        return user.id;
    }

    public async profile(c: Context,header : string): Promise<any> {
        const prisma = new PrismaClient({
            datasourceUrl : c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const token = header.split(' ')[1];
        if (!token) throw new Error("No token provided");

        const payload = await verifyToken(token, process.env.JWT_SECRET!);
        if (!payload) throw new Error("Invalid token");

        const user = await prisma?.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) throw new Error("User not found");

        return {
            id: user.id,
            username: user.username,
        };
    }
}

export const authController = Auth.getInstance();