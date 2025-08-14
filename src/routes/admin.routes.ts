import { Hono } from "hono";
import { adminController } from "../controller/admin.controller";

const adminRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    ARGON2_SECRET: string;
    NPM_PACKAGE_VERSION: string;
  };
}>();

adminRouter.post("/add-user", async (c) => {
  const body = await c.req.json();

  const { name, username, password } = body;

  if (!name || !username || !password) throw new Error("Invalid Body!");

  const res = adminController.addUser(c,name,username,password);

  return c.json({
    success : res,
    message : "User Added!"
  })
});

adminRouter.get("/users", async (c) => {
  const users = await adminController.getAllUsers(c);
  return c.json(users);
});

adminRouter.delete("/user/:id", async (c) => {
  const userId = c.req.param("id");
  await adminController.deleteUser(c, userId);
  return c.json({ success: true, message: "User deleted successfully" });
});

adminRouter.put("/user/:id", async (c) => {
  const userId = c.req.param("id");
  const data = await c.req.json();
  const updatedUser = await adminController.updateUser(c, userId, data);

  if (!updatedUser) {
    return c.json(
      { success: false, message: "User not found or update failed" },
      404
    );
  }

  return c.json({
    success: true,
    message: "User updated successfully",
    user: updatedUser,
  });
});

adminRouter.get("/user/:id", async (c) => {
  const userId = c.req.param("id");
  const users = await adminController.getAllUsers(c);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return c.json({ success: false, message: "User not found" }, 404);
  }

  return c.json(user);
});

adminRouter.post("/allot-bin", async (c) => {
  const { userId, binId, routeId } = await c.req.json();

  if (!userId || !binId || !routeId) {
    return c.json(
      { success: false, message: "User ID and Bin ID are required" },
      400
    );
  }

  const success = await adminController.allotBinToUser(
    c,
    userId,
    binId,
    routeId
  );

  if (!success) {
    return c.json(
      { success: false, message: "Failed to allot bin to user" },
      500
    );
  }

  return c.json({
    success: true,
    message: "Bin allotted to user successfully",
  });
});

adminRouter.delete("/remove-bin", async (c) => {
  const { userId, binId } = await c.req.json();

  if (!userId || !binId) {
    return c.json(
      { success: false, message: "User ID and Bin ID are required" },
      400
    );
  }

  const success = await adminController.removeBinFromUser(c, userId, binId);

  if (!success) {
    return c.json(
      { success: false, message: "Failed to remove bin from user" },
      500
    );
  }

  return c.json({
    success: true,
    message: "Bin removed from user successfully",
  });
});

adminRouter.get("/bins", async (c) => {
  const bins = await adminController.getAllBins(c);
  return c.json(bins);
});

adminRouter.post("/bin", async (c) => {
  const { location, tag } = await c.req.json();

  if (!location || !tag) {
    return c.json(
      { success: false, message: "Location and Tag are required" },
      400
    );
  }

  const bin = await adminController.addBin(c, {
    binId: crypto.randomUUID(), // Generate a unique bin ID
    location,
    tag,
  });

  if (!bin) {
    return c.json({ success: false, message: "Failed to create bin" }, 500);
  }

  return c.json({ success: true, message: "Bin created successfully", bin });
});

adminRouter.put("/bin/:id", async (c) => {
  const binId = c.req.param("id");
  const data = await c.req.json();

  const updatedBin = await adminController.updateBin(c, binId, data);

  if (!updatedBin) {
    return c.json(
      { success: false, message: "Bin not found or update failed" },
      404
    );
  }

  return c.json({
    success: true,
    message: "Bin updated successfully",
    bin: updatedBin,
  });
});

adminRouter.get("/bin/:id", async (c) => {
  const binId = c.req.param("id");
  const bin = await adminController.getBin(c, binId);

  if (!bin) {
    return c.json({ success: false, message: "Bin not found" }, 404);
  }

  return c.json(bin);
});

adminRouter.delete("/bin/:id", async (c) => {
  const binId = c.req.param("id");
  const success = await adminController.deleteBin(c, binId);

  if (!success) {
    return c.json({ success: false, message: "Failed to delete bin" }, 500);
  }

  return c.json({ success: true, message: "Bin deleted successfully" });
});

adminRouter.get("/allotments", async (c) => {
  const allotments = await adminController.getAllAllotments(c);
  return c.json(allotments);
});

adminRouter.get("/allotment/:id", async (c) => {
  const allotmentId = c.req.param("id");
  const allotment = await adminController.getAllotment(c, allotmentId);

  if (!allotment) {
    return c.json({ success: false, message: "Allotment not found" }, 404);
  }

  return c.json(allotment);
});

adminRouter.delete("/allotment/:id", async (c) => {
  const allotmentId = c.req.param("id");
  const success = await adminController.deleteAllotment(c, allotmentId);

  if (!success) {
    return c.json(
      { success: false, message: "Failed to delete allotment" },
      500
    );
  }

  return c.json({ success: true, message: "Allotment deleted successfully" });
});

export default adminRouter;
