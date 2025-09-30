// src/models/Incidente.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Incidente {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tipo!: string;

  @Column()
  descripcion!: string;

  @Column("float")
  lat!: number;

  @Column("float")
  lng!: number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  fecha!: Date;
}
