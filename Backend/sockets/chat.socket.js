import mistral from "../config/mistral.config.js"
import getAnswer from "../langchain/chain/qa.chain.js";
import deleteRecordsBySocketID from "../langchain/vectorstores/pineconde.delete.js";

const   handleSocketConnection = (socket) => {
    console.log('✅ A client connected:', socket.id);
  socket.on("user_message", async (data) => {
    const message  = data;
    // console.log("message is =>" + data);

    if (!message) {
      socket.emit("bot_message", { reply: "Message is required!" });
      return;
    }
    console.log(message);
    try {
      const result= await getAnswer(message,socket.id);
      // const result = await mistral.invoke(message);
      socket.emit("bot_message", { reply: result });
    } catch (error) {
      console.error("MistralAI Error:", error);
      socket.emit("bot_message", { reply: "⚠️ Something went wrong with the AI" });
    }
  });

  socket.on("disconnect", async() => {
    console.log(await deleteRecordsBySocketID(socket.id));
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
};

export default handleSocketConnection;
