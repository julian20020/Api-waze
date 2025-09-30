// src/entities/User.entieties.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm";

@Entity("usuarios")
@Unique(["email"])
export class Usuario {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ default: "user" })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
