import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";

config();

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Phải có dòng này

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
