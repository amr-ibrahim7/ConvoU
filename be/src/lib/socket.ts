import { Server } from "socket.io";
import http from "http";
import express from "express";
import { AuthenticatedSocket, socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";


export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
});


const userSocketMap: { [key: string]: string } = {};

export const getReceiverSocketId = (receiverId: string) => {
  return userSocketMap[receiverId];
};

io.use(socketAuthMiddleware);

io.on("connection", (socket: AuthenticatedSocket) => {
  const user = socket.user;
  if (!user) return socket.disconnect();

  console.log(`User connected: ${user.fullName} (ID: ${user.id})`);
  userSocketMap[user.id] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${user.fullName}`);
    delete userSocketMap[user.id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});