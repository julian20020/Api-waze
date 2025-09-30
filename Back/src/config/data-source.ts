// src/config/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../entities/User.entieties";
import { Report } from "../entities/reporte.entitie";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,   // crea las tablas si no existen
  dropSchema: true,    // 🔥 elimina todas las tablas y las vuelve a crear vacías
  logging: false,
  entities: [Usuario, Report],
  migrations: [],
  subscribers: [],
});

