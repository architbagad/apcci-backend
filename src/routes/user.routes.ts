import { Context, Hono } from "hono";
import { authController } from "../controller/auth.controller";

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL : string;
        JWT_SECRET: string;
        ARGON2_SECRET: string;
        NPM_PACKAGE_VERSION: string;
    }
}>();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, missing fields
 *       500:
 *         description: Internal server error
 *     security:
 *       - BearerAuth: []
 */
userRouter.post("/register", async (c : Context) => {
    
    const { username, password } = await c.req.json();

    const id = await authController.register(c,username, password)

    return c.json({
        id,
        success : true,
        message : "User registered successfully"
    });
});

/** * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns user data and token
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */
userRouter.post("/login", async (c : Context) => {
    const { username, password } = await c.req.json();

    const response = await authController.login(c,username, password);

    if (!response) {
        return c.json({
            success: false,
            message: "Invalid username or password"
        }, 401);
    }

    return c.json({
        ...response,
        success: true,
        message: "Login successful"
    });
});

/** * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Returns user profile data
 *       401:
 *         description: Unauthorized, token required
 */
userRouter.post("/logout", async (c : Context) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return c.json({ success: false, message: "Token is required" }, 400);
    }

    await authController.logout(token);

    return c.json({ success: true, message: "Logout successful" });
});

export default userRouter;