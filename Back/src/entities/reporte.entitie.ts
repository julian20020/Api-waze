import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Usuario } from "./User.entieties";

export enum ReportType {
  RETEN = "reten",
  CALLE_DANIADA = "calle dañada",
  TRAFICO_EXTENSO = "trafico extenso",
  ACCIDENTE = "accidente",
  OTRO = "otro"
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
