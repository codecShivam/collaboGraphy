const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("draw-line", ({ currentPoint, prevPoint, color }: DrawLine) => {
    socket.broadcast.emit('draw-lint', { currentPoint, prevPoint, color})
  });
});
