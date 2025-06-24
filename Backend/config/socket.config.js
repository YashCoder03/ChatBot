import server from "../server.js";
import handleSocketConnection from "../sockets/chat.socket.js"
import { Server } from "socket.io";
import { registerSocketHandlers } from "../sockets/registerSocketHandlers.socket.js";

let io;
export const initSocket = () => {
    io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] },
    });
    io.on('connection', (socket) => registerSocketHandlers(socket, io));
    return io;
}

export const getIO = () => {
  if(io) {
    return io;
  }
  console.log("some error in socket");
  return "";
}



