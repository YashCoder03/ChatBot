import mistral from "../config/mistral.config.js"
import getAnswer from "../langchain/chain/qa.chain.js";
import deleteRecordsBySocketID from "../langchain/vectorstores/pineconde.delete.js";
import { handleGeneralQuestion,classifyChain } from "../handler/message.handler.js";
import { classifyAgent } from "../langchain/agent/classify.agent.js";
import { getItineraryChain } from "../langchain/chain/travelAgent.chain.js";

const chatHandlers = (socket) => {
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
      const reply = await classifyAgent(message,socket.id);
      // let result ;
      // const type = await classifyMessage(message);
      // if (type === "PDF") {
      //   result = await getAnswer(message,socket.id);
      // } else {
      //   result = await  handleGeneralQuestion(message,socket.id);
      // }
      // const result = await mistral.invoke(message);
      socket.emit("bot_message", { reply: reply });
    } catch (error) {
      console.error("MistralAI Error:", error);
      socket.emit("bot_message", { reply: "⚠️ Something went wrong with the AI" });
    }
  });
  socket.on("travel_agent",async(data) => {
    const chain = getItineraryChain();
    console.log(data);
    const rawResponse = await chain.invoke(
      { source : "Jalgaon", destination : "Goa", mode : "Train", food : "Veg", budget : "High",number_of_days : 5 },
      { configurable: { sessionId: socket.id } }
    );
    console.log(rawResponse);
    let structured;
    try {
      structured = JSON.parse(rawResponse);
    } catch (e) {
      console.error("❌ Failed to parse itinerary:", e);
      structured = {
        summary: "Could not generate itinerary.",
        travel: {},
        hotel: {},
        restaurant: {},
      };
    }

    console.log(JSON.stringify(structured));
    socket.emit("bot_message", { reply: JSON.stringify(structured) });
    });

  socket.on("disconnect", async() => {
    console.log(await deleteRecordsBySocketID(socket.id));
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
};

const isPDFQuestion = (question) => {
  return question.toLowerCase().includes("pdf") || question.includes("document");
};

export default chatHandlers;
