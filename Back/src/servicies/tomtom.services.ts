// src/services/tomtom.service.ts
import axios from "axios";

export async function getTrafficTomTom(lat: number, lon: number) {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey) throw new Error("TOMTOM_API_KEY no configurado en .env");

  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&key=${apiKey}`;

  const { data } = await axios.get(url);

  return {
    velocidadPromedio: data.flowSegmentData.currentSpeed,
    velocidadLibre: data.flowSegmentData.freeFlowSpeed,
    nivelCongestion: data.flowSegmentData.confidence,
  };
}
