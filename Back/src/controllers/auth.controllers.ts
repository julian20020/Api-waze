// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { Usuario } from "../entities/User.entieties";

const userRepo = () => AppDataSource.getRepository(Usuario);

// Registro de usuario
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email y password son obligatorios" });
    }

    const repo = userRepo();
    const exists = await repo.findOneBy({ email });
    if (exists) {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = repo.create({
      name: name || null,
      email,
      password_hash: hashed,
    });

    await repo.save(user);

    // Omitimos el password en la respuesta
    const { password_hash, ...safe } = user as any;

    return res.status(201).json({ ok: true, user: safe });
  } catch (err) {
    console.error("Error en register:", err);
    return res.status(500).json({ error: "Error interno en el registro" });
  }
}

// Login de usuario
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email y password son obligatorios" });
    }

    const repo = userRepo();
    const user = await repo.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 👇 OJO AQUÍ: usar siempre la misma secret para firmar/verificar
    if (!process.env.JWT_SECRET) {
      console.warn("⚠️ JWT_SECRET no está definido en el .env, usando 'changeme'");
    }
    const secret = process.env.JWT_SECRET || "changeme";

    // Generamos el token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      secret,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ error: "Error interno en el login" });
  }
}
