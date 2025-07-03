import { useState } from "react";
import { Menu, Settings, SquarePen } from "lucide-react";
import type ChatState from "../interfaces/chats";

interface sideBarProps {
  messages: ChatState;
  newChat: () => void;
  activeChatId: (chatId: string) => void;
}

export default function SideBar({ messages, newChat, activeChatId }: sideBarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "New Chat", icon: SquarePen },
    { name: "Settings", icon: Settings },
  ];

  const handleBtnClick = (btnName: string): void => {
    if (btnName === 'New Chat') {
      console.log('new chat clicked');
      newChat();
    }
  }

  return (
    <div className={`h-[700px] bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col transition-all duration-300  ${isOpen ? 'w-60' : 'w-16'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold transition-opacity duration-300 opacity-100">{isOpen && 'ChatBot'}</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Menu size={24} />
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-2 p-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleBtnClick(item.name)}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#eee0e0] dark:hover:bg-gray-800 transition-colors"
          >
            <item.icon size={24} />
            {isOpen &&
              <span className="transition-opacity duration-300 opacity-100">{item.name}</span>}
          </button>
        ))}
        <div className="mt-5 text-[#c3bbbb]">
          <h5>Chats</h5>
          {Object.keys(messages?.chats ?? {}).map((chatId, index) => (
            <li className="cursor-pointer" key={index} onClick={() => activeChatId(chatId)}>{chatId}</li>
          ))}
        </div>
      </div>

    </div>
  );
}
