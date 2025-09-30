import api from "./api";

export interface RouteResponse {
  ruta: {
    distancia: string;
    duracion: string;
    // opcional: geometry (si tu backend la envía)
    geometry?: { type: string; coordinates: number[][] };
  };
  trafico?: Array<{
    lat: number | string;
    lng: number | string;
    velocidad?: string | number;
    nivelCongestion?: number;
  }>;
}

/**
 * Llama a tu endpoint /ruta. 
 * changeFormat: indica si el backend espera 'lat,lng' o 'lng,lat' (ver nota más abajo)
 */
export async function fetchRoute(
  origen: string, // "lat,lng"
  destino: string
): Promise<RouteResponse> {
  const res = await api.get("/ruta", {
    params: { origen, destino },
  });
  return res.data;
}

export async function fetchTraffic(lat: number, lng: number) {
  // ejemplo: backend expone /trafico?lat=..&lon=..
  const res = await api.get("/trafico", {
    params: { lat, lon: lng },
  });
  return res.data;
}
