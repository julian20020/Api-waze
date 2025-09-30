// src/routes/ruta.routes.ts
import { Router, Request, Response } from "express";
import { getRouteFromMapbox } from "../servicies/mapbox.service";
import { getTrafficTomTom } from "../servicies/tomtom.services";

const router = Router();

/**
 * GET /api/ruta?origen=lng,lat&destino=lng,lat
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { origen, destino } = req.query;
    if (!origen || !destino) {
      return res.status(400).json({
        ok: false,
        msg: "Parámetros requeridos: origen=lng,lat y destino=lng,lat",
      });
    }

    const [origLng, origLat] = (origen as string).split(",").map(Number);
    const [dstLng, dstLat] = (destino as string).split(",").map(Number);

    // 1) Ruta desde Mapbox
    const route:any = await getRouteFromMapbox(origLng, origLat, dstLng, dstLat);

    const routeData = route.routes[0];
    const distanceKm = (routeData.distance / 1000).toFixed(2); // km
    const durationMin = (routeData.duration / 60).toFixed(1); // min

    // 2) Tomamos algunos puntos del recorrido
    const coords = routeData.geometry.coordinates;
    const sampledPoints = coords.filter((_:any, i:any) => i % 10 === 0);

    // 3) Consultamos tráfico con TomTom
    const trafico = [];
    for (const [lng, lat] of sampledPoints) {
      try {
        const info = await getTrafficTomTom(lat, lng);
        trafico.push({
          lat: lat.toFixed(5),
          lng: lng.toFixed(5),
          velocidad: `${info.velocidadPromedio} km/h`,
          nivelCongestion: info.nivelCongestion,
        });
      } catch {
        // si falla en algún punto no rompemos la respuesta
      }
    }

    // 4) Respuesta limpia
    res.json({
      ok: true,
      ruta: {
        distancia: `${distanceKm} km`,
        duracion: `${durationMin} min`,
        puntos: sampledPoints.length, // cuántos puntos se usaron para tráfico
      },
      trafico,
    });
  } catch (error) {
    console.error("Error en /api/ruta:", error);
    res.status(500).json({ ok: false, msg: "Error obteniendo ruta con tráfico" });
  }
});

export default router;
