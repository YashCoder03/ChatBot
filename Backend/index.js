const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { handleSocketConnection } = require('./sockets/chat.socket');

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
