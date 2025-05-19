import { Router } from "express";
import { confirmOrder } from "../controllers/orderController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js"

const router = Router();

router.post("/confirm", authenticateToken, confirmOrder);

export default router;
