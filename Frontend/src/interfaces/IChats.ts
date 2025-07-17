
export interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: number;
};

export interface chat {
  name: string,
  messages: Message[],
}

export default interface ChatState {
    activeChatId: string;
    chats: Record<string, chat>

};
