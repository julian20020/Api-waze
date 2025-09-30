import { Router } from "express";
import { createReportController, listReportsController } from "../controllers/Reporte.controllers";
import { authMiddleware } from "../middlewares/auth.middlewares";

const router = Router();

// Crear reporte (requiere login con token)
router.post("/", authMiddleware, createReportController);

// Listar reportes (público o si quieres también protegido con auth)
router.get("/", listReportsController);

export default router;