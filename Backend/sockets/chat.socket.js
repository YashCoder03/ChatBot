const mistral = require("../config/mistral.config");

exports.handleSocketConnection = (socket) => {
    console.log('✅ A client connected:', socket.id);
  socket.on("user_message", async (data) => {
    const message  = data;
    console.log("message is =>" + data);

    if (!message) {
      socket.emit("bot_message", { reply: "Message is required!" });
      return;
    }

    try {
      const result = await mistral.invoke(message);
      console.log(result.content);
      socket.emit("bot_message", { reply: result.content });
    } catch (error) {
      console.error("MistralAI Error:", error);
      socket.emit("bot_message", { reply: "⚠️ Something went wrong with the AI" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
};
