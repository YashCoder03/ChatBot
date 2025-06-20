import { ChatMistralAI } from "@langchain/mistralai";


const mistral = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-large-latest",
  temperature: 0.7,
});

export default mistral;
