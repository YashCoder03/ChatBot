import { MistralAIEmbeddings } from "@langchain/mistralai";
import { configDotenv } from 'dotenv';
configDotenv()

const mistral = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed", // ✅ correct model for embeddings
});

export default mistral;
// export default "";