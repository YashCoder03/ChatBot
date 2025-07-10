import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq"


// const mistral = new ChatMistralAI({
//   apiKey: process.env.MISTRAL_API_KEY,
//   model: "mistral-large-latest",
//   temperature: 0.7,
// });
const mistral = new ChatGroq({
  apiKey: process.env.GROK_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

export default mistral;
