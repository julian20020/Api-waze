// src/routes/api.routes.ts
import { Router } from 'express';
import { crearIncidente } from '../controllers/incident.controllers';
// import { authMiddleware } from '../middlewares/auth.middlewares';

const router = Router();

// POST /api/incidente (se puede proteger con auth middleware si deseas)
router.post('/incidente', crearIncidente);

// añadiremos más endpoints aquí: /ruta, /trafico, /servicios, /alertas

export default router;
