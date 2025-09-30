export interface RutaResponse {
  ok: boolean;
  ruta: {
    distancia: string;
    duracion: string;
    puntos: number;
  };
  trafico: {
    lat: string;
    lng: string;
    velocidad: string;
    nivelCongestion: number;
  }[];
}
