import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

const sessionHistories = new Map(); // socket.id => ChatMessageHistory

export const getSessionHistory = (sessionId) => {
  if (!sessionHistories.has(sessionId)) {
    sessionHistories.set(sessionId, new ChatMessageHistory());
  }
  return sessionHistories.get(sessionId);
}