import { Router } from "express";
import rutaRoutes from "./ruta.routes";
import traficoRoutes from "./trafico.routes";

const router = Router();

router.get("/", (req, res) => {
  res.send("Api waze pasto funcionando correctamente");
});

// Conectar rutas
router.use("/ruta", rutaRoutes);
router.use("/trafico", traficoRoutes);
// router.use("/incidente", incidenteRoutes);

export default router;
