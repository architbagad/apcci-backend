import { Allotment, PrismaClient, ScanBin, User } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

class Admin {
    private static instance: Admin | null = null;

    public static getInstance(): Admin {
        if (!Admin.instance) {
            Admin.instance = new Admin();
        }
        return Admin.instance;
    }

    private constructor() {}

    public async getAllUsers(c: Context): Promise<User[]> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const users = await prisma.user.findMany();
        return users;
    }

    public async deleteUser(c: Context, userId: string): Promise<void> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        await prisma.user.delete({
            where: { id: userId },
        });
    }

    public async updateUser(c: Context, userId: string, data: Partial<User>): Promise<User | null> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
        });
        

        return updatedUser.id ? updatedUser : null;
    }

    public async allotBinToUser(c: Context, userId: string, binId: string,routeId : string): Promise<boolean> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const allotment = await prisma.allotment.create({
            data: {
                userId,
                binId,
                routeId
            },
        });

        return allotment ? true : false;
    }

    public async removeBinFromUser(c: Context, userId: string, binId: string): Promise<boolean> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const allotment = await prisma.allotment.deleteMany({
            where: {
                userId,
                binId,
            },
        });

        return allotment.count > 0;
    }

    public async addBin(c: Context, binData: { binId: string; location?: string,tag : string }): Promise<boolean> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const bin = await prisma.scanBin.create({
            data: {
                binId: binData.binId,
                location: binData.location,
                tag: binData.tag
            },
        });

        return !!bin;
    }

    public async getBin(c: Context, binId: string): Promise<any> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const bin = await prisma.scanBin.findUnique({
            where: { binId },
        });

        return bin ? bin : null;
    }

    public async updateBin(c: Context, binId: string, data: Partial<{ location: string; tag: string }>): Promise<ScanBin | null> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const updatedBin = await prisma.scanBin.update({
            where: { binId },
            data,
        });

        return updatedBin ? updatedBin : null;
    }

    public async deleteBin(c: Context, binId: string): Promise<boolean> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const deletedBin = await prisma.scanBin.delete({
            where: { binId },
        });

        return !!deletedBin;
    }   

    public async getAllBins(c: Context): Promise<ScanBin[]> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const bins = await prisma.scanBin.findMany();
        return bins;
    }

    public async getAllAllotments(c: Context): Promise<Allotment[]> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const allotments = await prisma.allotment.findMany({
            include: {
                user: true,
                scanBin: true,
            },
        });

        return allotments;
    }

    public async getAllotment(c: Context, allotmentId: string): Promise<Allotment | null> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const allotment = await prisma.allotment.findUnique({
            where: { id: allotmentId },
            include: {
                user: true,
                scanBin: true,
            },
        });

        return allotment ? allotment : null;
    }

    public async deleteAllotment(c: Context, allotmentId: string): Promise<boolean> {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const deletedAllotment = await prisma.allotment.delete({
            where: { id: allotmentId },
        });

        return !!deletedAllotment;
    }

}

export const adminController = Admin.getInstance();

