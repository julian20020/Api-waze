// src/services/socket.ts
import { Server as IOServer } from 'socket.io';

let io: IOServer | null = null;

// setea el io creado en server.ts
export function setIO(serverIO: IOServer) {
  io = serverIO;
}

// obtener io desde otros módulos (controllers) evitando circular imports
export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
