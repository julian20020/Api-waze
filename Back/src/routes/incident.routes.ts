import { Router } from "express";
import { crearIncidente, listarIncidentes } from "../controllers/incident.controllers";

const router = Router();

router.post("/", crearIncidente);
router.get("/", listarIncidentes);

export default router;
