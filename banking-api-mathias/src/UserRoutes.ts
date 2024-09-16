import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { AuthController } from "./controllers/AuthController";

const userRoutes = Router();
const userController = new UserController();
const path = "/users";
const authController = new AuthController();

userRoutes.post(path, authController.authMiddleware, userController.create);

userRoutes.get(path, authController.authMiddleware, userController.getAll);

userRoutes.get(`${path}/:id`, authController.authMiddleware, userController.getById);

userRoutes.delete(`${path}/:id`, authController.authMiddleware, userController.verifyIfExists, userController.delete);

userRoutes.put(`${path}/:id`, authController.authMiddleware, userController.verifyIfExists, userController.update);

userRoutes.post("/auth", authController.authenticate);

export { userRoutes }