import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Incidente } from "../models/incidente.model";

const repo = AppDataSource.getRepository(Incidente);

export const crearIncidente = async (req: Request, res: Response) => {
  try {
    const { tipo, descripcion, lat, lng } = req.body;

    const incidente = repo.create({ tipo, descripcion, lat, lng });
    await repo.save(incidente);

    return res.status(201).json(incidente);
  } catch (error) {
    return res.status(500).json({ message: "Error creando incidente", error });
  }
};

export const listarIncidentes = async (req: Request, res: Response) => {
  try {
    const incidentes = await repo.find();
    return res.json(incidentes);
  } catch (error) {
    return res.status(500).json({ message: "Error listando incidentes", error });
  }
};
