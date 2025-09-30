// src/services/mapbox.service.ts
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getRouteFromMapbox(origLng: number, origLat: number, dstLng: number, dstLat: number) {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) throw new Error('MAPBOX_TOKEN no configurado en .env');
  const coords = `${origLng},${origLat};${dstLng},${dstLat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error desde Mapbox');
  const j = await res.json();
  return j; // contiene rutas, distancia, duración, geometry
}
