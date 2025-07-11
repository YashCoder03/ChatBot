import { useEffect, useRef, useState } from "react";
import { Menu, Settings, SquarePen } from "lucide-react";
import type ChatState from "../interfaces/chats";

interface sideBarProps {
  isSideBarOpen: boolean;
  setSideBarIsOpen: (val: boolean) => void;
  messages: ChatState;
  newChat: () => void;
  activeChatId: string;
  setActiveChatId: (chatId: string) => void;
}

export default function SideBar({
  isSideBarOpen,
  setSideBarIsOpen,
  messages,
  newChat,
  activeChatId,
  setActiveChatId,
}: sideBarProps) {
  const menuItems = [
    { name: "New Chat", icon: SquarePen },
    { name: "Settings", icon: Settings },
  ];

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768 // Only on mobile
      ) {
        setSideBarIsOpen(false);
      }
    }
    if (isSideBarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideBarOpen]);

  const handleBtnClick = (btnName: string): void => {
    if (btnName === "New Chat") {
      console.log("new chat clicked");
      newChat();
    }
  };

  const handleChatOnClick = (chatId: string) => {
    setActiveChatId(chatId);
    setSideBarIsOpen(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed md:relative z-50 p-1
          transition-all duration-300 ease-in-out
          ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          ${isSideBarOpen ? "w-64" : "w-16"} 
          ${
            isSideBarOpen && "shadow-lg"
          } md:block min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col transition-all duration-300  ${
        isSideBarOpen ? "w-60" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold transition-opacity duration-300 opacity-100">
          {isSideBarOpen && "ChatBot"}
        </h1>
        <button className="cursor-pointer" onClick={() => setSideBarIsOpen(!isSideBarOpen)}>
          <Menu size={24} />
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-2 p-2 w-40">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleBtnClick(item.name)}
            className="flex items-center cursor-pointer gap-4 p-3 rounded-xl hover:bg-[#eee0e0] dark:hover:bg-gray-800 transition-colors"
          >
            <item.icon size={24} />
            {isSideBarOpen && (
              <span className="transition-opacity duration-300 opacity-100">
                {item.name}
              </span>
            )}
          </button>
        ))}
        {isSideBarOpen && (
          <div className="mt-5 text-[#c3bbbb]">
            <h5>Chats</h5>
            <div className="mt-3 ml-5">
              {Object.keys(messages?.chats ?? {}).map((chatId, index) => (
                <li
                  className={`cursor-pointer list-none m-1 tracking-widest ${
                    activeChatId === chatId && "font-bold"
                  }`}
                  key={index}
                  onClick={() => handleChatOnClick(chatId)}
                >
                  {chatId}
                </li>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
