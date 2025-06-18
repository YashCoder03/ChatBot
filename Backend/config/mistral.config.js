const { ChatMistralAI } = require("@langchain/mistralai");
require("dotenv").config();

const mistral = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-large-latest",
  temperature: 0.7,
});

module.exports = mistral;
