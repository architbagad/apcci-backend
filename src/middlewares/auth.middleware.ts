import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { getUserIdFromToken } from "../utils/token";

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return c.json({ success: false, message: "Token is required" }, 401);
  }

  const username = await getUserIdFromToken(token);

  if (!username) {
    return c.json({ success: false, message: "Invalid token" }, 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: username },
  });

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 404);
  }

  c.set("user", user);
  await next();
};
