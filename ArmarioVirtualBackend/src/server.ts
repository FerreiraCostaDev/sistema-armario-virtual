import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';

import vendedorRoutes from './routes/vendedorRoutes';
import clienteRoutes from './routes/clienteRoutes';
import qrcodeRoutes from './routes/qrcodeRoutes';
import produtoRoutes from './routes/produtoRoutes';
import lookRoutes from './routes/lookRoutes';


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (req, res) => {
  res.json({ message: '🚀 Armário Virtual API rodando!' });
});

app.use('/vendedor', vendedorRoutes);
app.use('/cliente', clienteRoutes);
app.use('/qrcode', qrcodeRoutes);
app.use('/produto', produtoRoutes)
app.use('/look', lookRoutes);


// WebSocket
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3333;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});