import { Runnable, RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import mistral from "../config/mistral.config.js";
import mistralembedding from "../config/mistralembedding.config.js";
import { getIO } from "../config/socket.config.js";
import getDocument from "../langchain/vectorstores/pincecone.retriver.js";
import { getSessionHistory } from "./history.handler.js";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getBaseChain } from "../langchain/chain/basic.chain.js";
import { LLM } from "@langchain/core/language_models/llms";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const classifyMessage = async (question) => {
  
  const questionEmbedding = await mistralembedding.embedQuery(question);
  const io = getIO();
  const id = io.id;
  const vectorData =await getDocument(questionEmbedding,id);
  
  const classifierPrompt = ChatPromptTemplate.fromTemplate(`
    You are a classifier that decides whether a user's question is about a specific PDF document or a general chat question.

    Instructions:
    - If the question is asking about information that could be found in the provided context (from the PDF), respond with exactly "PDF".
    - If the question is general, casual, or unrelated to the context, respond with exactly "CHAT".

    Question: {question}

    Context:
    {context}

    Respond with only one word: "PDF" or "CHAT".
  `);
  const context = vectorData.matches
  .map((m) => m.metadata?.content || "")
  .join("\n\n")
  .slice(0, 3000);

    const classifierChain = RunnableSequence.from([
      classifierPrompt,
      mistral,
      new StringOutputParser()
    ]);
    const result = await classifierChain.invoke({
      question: question,
      context: context,
    });
    return result;
};

export const handleGeneralQuestion = async (message,socketId) => {
  const MemoryWrappedChain = getMemoryWrappedChain(socketId);

  const answer = await MemoryWrappedChain.invoke({ input: message }, { configurable: { sessionId: socketId } });
  return answer;
};

const getMemoryWrappedChain = (socketId) => {
  const baseChain = getBaseChain();
  return new RunnableWithMessageHistory({
    runnable: baseChain,
    getMessageHistory: async () => getSessionHistory(socketId),
    inputMessagesKey: 'input',
    historyMessagesKey: 'history',
  });
}

