import { Router } from "express";
import { createVNPayQR, vnpayReturn } from "../controllers/paymentController.js";

const router = Router();

router.post("/vnpay/create-qr", createVNPayQR);
router.get("/vnpay/return", vnpayReturn);

export default router;