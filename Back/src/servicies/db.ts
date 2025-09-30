// src/services/db.ts
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config(); // cargar variables de entorno

// Creamos el pool de conexiones con PostgreSQL
export const pool = new Pool({
  host: process.env.DB_HOST,   // localhost
  port: Number(process.env.DB_PORT), // 5432
  user: process.env.DB_USER,   // postgres
  password: process.env.DB_PASS, // 1234
  database: process.env.DB_NAME, // waze-clone
});

// Función helper para ejecutar queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}
