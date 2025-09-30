import axios from "axios";
import { getToken } from "./auth";

const API_URL = "http://localhost:3000/api/reports";

export const createReport = async (type: string, latitude: number, longitude: number) => {
  const token = getToken();
  if (!token) throw new Error("No hay token, inicia sesión primero");

  const res = await axios.post(
    API_URL,
    { type, latitude, longitude },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
