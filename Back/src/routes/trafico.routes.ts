// src/routes/trafico.routes.ts
import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

/**
 * GET /api/trafico?lat=1.2136&lon=-77.2811
 * Devuelve tráfico en tiempo real usando TomTom API
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        ok: false,
        msg: "lat y lon son requeridos. Ejemplo: /api/trafico?lat=1.2136&lon=-77.2811",
      });
    }

    const apiKey = process.env.TOMTOM_API_KEY;
    if (!apiKey) {
      throw new Error("TOMTOM_API_KEY no configurado en .env");
    }

    const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&key=${apiKey}`;

    const { data } = await axios.get(url);

    res.status(200).json({
      ok: true,
      trafico: {
        ubicacion: { lat, lon },
        velocidadPromedio: data.flowSegmentData.currentSpeed,
        velocidadLibre: data.flowSegmentData.freeFlowSpeed,
        nivelCongestion: data.flowSegmentData.confidence,
      },
    });
  } catch (error) {
    console.error("Error en /api/trafico:", error);
    res.status(500).json({
      ok: false,
      msg: "Error obteniendo información de tráfico en tiempo real",
    });
  }
});

export default router;
