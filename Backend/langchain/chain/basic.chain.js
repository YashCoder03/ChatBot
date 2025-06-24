import { StringOutputParser } from "@langchain/core/output_parsers";
import mistral from "../../config/mistral.config.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export const getBaseChain = () => {
  const prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. Use the chat history and answer the question.

        Chat History:
        {history}

        User: {input}
        Assistant:
        `);
  const baseChain = RunnableSequence.from([
    prompt,
    mistral,
    new StringOutputParser()
  ])

  return baseChain;
}