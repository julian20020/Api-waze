import { AppDataSource } from "../config/data-source";
import { Report, ReportType } from "../entities/reporte.entitie";
import { Usuario } from "../entities/User.entieties";

const reportRepository = AppDataSource.getRepository(Report);

export const createReport = async (
  userId: string,
  type: ReportType,
  latitude: number,
  longitude: number
) => {
  const user = await AppDataSource.getRepository(Usuario).findOneBy({ id: userId });
  if (!user) throw new Error("Usuario no encontrado");

  const report = reportRepository.create({
    type,
    latitude,
    longitude,
    user
  });

  return await reportRepository.save(report);
};
export const listReports = async () => {
  return await reportRepository.find({
    relations: ["user"], 
    order: { createdAt: "DESC" }, 
  });
};
