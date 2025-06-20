import http from "http";
import {Server} from "socket.io";
import app from "./app.js"
import handleSocketConnection  from "./sockets/chat.socket.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] },
});

// WebSocket logic
io.on('connection', (socket) => handleSocketConnection(socket, io));

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
