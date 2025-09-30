import { Request, Response } from "express";
import { createReport } from "../servicies/Reporte.services";
import { ReportType } from "../entities/reporte.entitie";

export const createReportController = async (req: Request, res: Response) => {
  try {
    const { type, latitude, longitude } = req.body;
    const userId = (req as any).user.userId; // 👈 ahora sí

    if (!Object.values(ReportType).includes(type)) {
      return res.status(400).json({ message: "Tipo de reporte inválido" });
    }

    const report = await createReport(userId, type, latitude, longitude);
    return res.status(201).json(report);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
