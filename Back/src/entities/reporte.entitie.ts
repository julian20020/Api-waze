import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Usuario } from "./User.entieties";

export enum ReportType {
  RETEN = "Reten",
  CALLE_DANIADA = "Calle Dañada",
  TRAFICO_EXTENSO = "Trafico Extenso",
  ACCIDENTE = "Accidente",
  OTRO = "Otro"
}

@Entity("reportes")
export class Report {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: ReportType
  })
  type!: ReportType;

  @Column("float")
  latitude!: number;

  @Column("float")
  longitude!: number;

  @ManyToOne(() => Usuario, { onDelete: "CASCADE" })
  user!: Usuario;

  @CreateDateColumn()
  createdAt!: Date;
}
