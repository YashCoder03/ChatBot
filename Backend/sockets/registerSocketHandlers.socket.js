import chatHandlers from "./chat.socket.js";

export const registerSocketHandlers = (socket, io) => {
  chatHandlers(socket, io);
};

