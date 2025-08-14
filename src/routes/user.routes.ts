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

userRouter.post("/register", async (c : Context) => {
    
    const { username, password } = await c.req.json();

    const payload = await authController.register(c,username, password)

    return c.json({
        user : {
            id : payload.id,
            role : payload.role,
        },
        token : payload.token,
        success : true,
        message : "User registered successfully"
    });
});

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

userRouter.get("/my-bins", async (c : Context) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return c.json({ success: false, message: "Token is required" }, 400);
    }

    const allotments = await authController.getUserAllotments(c,token);

    return c.json({
        allotments,
        success : true,
        message : "fetched allotments!"
    })
})

userRouter.post("/logout", async (c : Context) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return c.json({ success: false, message: "Token is required" }, 400);
    }

    await authController.logout(token);

    return c.json({ success: true, message: "Logout successful" });
});

export default userRouter;