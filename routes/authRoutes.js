import { Router } from "express";
import { register, login, getAllUsers } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/users", authenticateToken, getAllUsers);
router.post("/register", register);
router.post("/login", login);

export default router;
