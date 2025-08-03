import { Context, Hono } from "hono";
import { authController } from "../controller/auth.controller";

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL : string;
    }
}>();

userRouter.get("/login", async (c : Context) => {
    
    const { username, password } = await c.req.json();

    const id = await authController.register(username, password)

    return c.json({
        id,
        success : true,
        message : "User registered successfully"
    });
});

userRouter.post("/login", async (c : Context) => {
    const { username, password } = await c.req.json();

    const response = await authController.login(username, password);

    return c.json({
        ...response,
        success: true,
        message: "Login successful"
    });
});

userRouter.post("/logout", async (c : Context) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return c.json({ success: false, message: "Token is required" }, 400);
    }

    await authController.logout(token);

    return c.json({ success: true, message: "Logout successful" });
});

export default userRouter;