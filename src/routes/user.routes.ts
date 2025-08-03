import { Context, Hono } from "hono";

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL : string;
    }
}>();

userRouter.get("/", async (c : Context) => {
    return c.json({ message: "User route is working!" });
});