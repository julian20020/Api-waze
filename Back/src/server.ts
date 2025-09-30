// src/server.ts
import * as http from 'http';
import app from './app';
import { Server as IOServer } from 'socket.io';
import * as dotenv from 'dotenv';
import { setIO } from './servicies/socket';
import { AppDataSource } from './config/data-source';
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// configuramos Socket.io
const io = new IOServer(server, {
  cors: { origin: '*' }
});

// guardamos io en el singleton
setIO(io);

io.on('connection', (socket) => {
  console.log('Nuevo cliente socket conectado:', socket.id);

  socket.on('report:new', (data) => {
    // reemitimos a todos los clientes conectados
    io.emit('report:created', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
  });
});
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conectado a PostgreSQL con TypeORM");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar la base de datos:", error);
  });




