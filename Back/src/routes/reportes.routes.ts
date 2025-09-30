import { Router } from "express";
import { createReportController } from "../controllers/Reporte.controllers";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

router.post("/", authMiddleware, createReportController);

export default router;  // 👈 esto es lo importante
