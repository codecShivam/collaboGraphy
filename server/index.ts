const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

type Point = { x: number; y: number };

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  brushWidth: number;
};

io.on('connection', (socket) => {
  console.log('✔️ New user connected');

  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state');
  });

  socket.on('canvas-state', (state) => {
    socket.broadcast.emit('canvas-state-from-server', state);
  });

  socket.on('draw-line', (action: DrawLineProps) => {
    socket.broadcast.emit('draw-line', action);
  });

  socket.on('clear', () => io.emit('clear'));
});

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001');
});
