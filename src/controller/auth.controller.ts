import { hashPassword } from "../utils/hash";
import { createToken,verifyToken } from "../utils/token";

class Auth {
    private static instance: Auth;

    public static getInstance(): Auth {
        if (!Auth.instance) {
            Auth.instance = new Auth();
        }
        return Auth.instance;
    }
    
    constructor() {}

    public async login(username: string, password: string): Promise<any> {
        
        const user = await prisma?.user.findUnique({
            where: { username },
        });

        if (!user) throw new Error("User not found");

        const isPasswordValid = await hashPassword(password, process.env.ARGON2_SECRET!) === user.password;

        if (!isPasswordValid) throw new Error("Invalid password");

        const accessToken = await createToken({
            userId: user.id,
            username: user.username,
        }, process.env.JWT_SECRET!);

        const refreshToken = await createToken({
            userId: user.id,
            username: user.username,
        }, process.env.JWT_REFRESH_SECRET!);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
            },
        };
    }

    public async logout(token: string): Promise<void> {
    
    }

    public async register(username: string, password: string): Promise<string> {
        
        const user = await prisma?.user.create({
            data: {
                username,
                password : await hashPassword(password,process.env.ARGON2_SECRET!),
            },
        })
        if (!user) throw new Error("User creation failed");
        
        return user.id;
    }

    public async profile(header : string): Promise<any> {
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