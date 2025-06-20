import { MistralAIEmbeddings } from "@langchain/mistralai";
import { configDotenv } from 'dotenv';
configDotenv()

const mistralembedding = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed", // ✅ correct model for embeddings
});

export default mistralembedding;
// export default "";