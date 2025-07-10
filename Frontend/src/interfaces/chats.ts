
export interface Message {
  sender: 'bot' | 'user';
  text: string;
  time: number;
};


    // export interface Chat {
    // id?: string;
    // title?: string;
    // createdAt?: number;
    // updatedAt?: number;
    // messages: Message[];
    // };

export default interface ChatState {
    activeChatId: string;
    chats: Record<string, Message[]>;
};
