import { Router } from "express";
import { addToCart, buyNow, getCart } from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/add", authenticateToken, addToCart);
router.post("/buynow", authenticateToken, buyNow);
router.get("/view", authenticateToken, getCart);

export default router;
