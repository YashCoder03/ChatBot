import { StringOutputParser } from "@langchain/core/output_parsers";
import mistral from "../../config/mistral.config.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const answerSchema = z.object({
  header: z.string(),
  content: z.array(z.string()),
  code: z.string(),
});

const parser = new StructuredOutputParser(answerSchema);

export const getBaseChain = () => {
  const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant. Use the chat history to answer the user question clearly and thoroughly.

    Chat History:
    {history}

    User: {input}

    Please format your answer as JSON using these instructions:

    {format_instructions}

    Assistant:
    `);

  const baseChain = RunnableSequence.from([
    RunnableMap.from({
      input: (input) => input.input,
      history: (input) => input.history,
      format_instructions: () => parser.getFormatInstructions(),
    }),
    prompt,
    mistral,
    parser, 
  ]);

  return baseChain;
}