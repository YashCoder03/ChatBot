import { Runnable, RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import mistral from "../config/mistral.config.js";
import mistralembedding from "../config/mistralembedding.config.js";
import { getIO } from "../config/socket.config.js";
import getDocument from "../langchain/vectorstores/pincecone.retriver.js";
import { getSessionHistory } from "./history.handler.js";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getBaseChain } from "../langchain/chain/basic.chain.js";

export const classifyMessage = async (question) => {
  
  const questionEmbedding = await mistralembedding.embedQuery(question);
  const io = getIO();
  const id = io.id;
  const vectorData =await getDocument(questionEmbedding,id);
  const hasRelevantMatch = vectorData.matches.some((match) => match.score > 0.55 && match.metadata?.content);
  
  const classifierPrompt = `Classify this user question:
    Question: "${question}"
    Context: "${vectorData?.metadata?.content || ''}"

    Does this question relate to the context? Reply with "PDF" or "CHAT".`;
    if(hasRelevantMatch) {return "PDF"} else {"CHAT";}
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

