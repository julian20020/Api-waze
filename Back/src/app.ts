// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "express-async-errors"; // permite lanzar errores en async handlers
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc"; 
import apiRoutes from "./routes/api.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import rutaRoutes from "./routes/ruta.routes";
import traficoRoutes from "./routes/trafico.routes";
import reportRoutes from "./routes/reportes.routes";
import { AppDataSource } from "./config/data-source"; // Ajusta la ruta si tu archivo de configuración tiene otro nombre o ubicación

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(helmet()); // cabeceras de seguridad
app.use(cors()); // habilitar CORS
app.use(express.json({ limit: "10mb" })); // parsear JSON en body

// Swagger config
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pasto Waze API",
      version: "0.1.0",
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Organización de rutas
app.use("/api/auth", authRoutes);   // -> /api/auth/register, /api/auth/login
app.use("/api/ruta", rutaRoutes);   // -> /api/ruta?origen&destino
app.use("/api/trafico", traficoRoutes); // -> /api/trafico
app.use("/api", apiRoutes);         // -> /api (ping de estado general)
app.use("/api/reportes", reportRoutes); // -> /api/reportes

// Middleware centralizado de errores
app.use(errorHandler);

export default app;
