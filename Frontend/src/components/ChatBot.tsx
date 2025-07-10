import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Paperclip } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import SideBar from "./SideBar";
import type ChatState from "../interfaces/chats";

const URL = "https://chatbot-production-2562.up.railway.app";
// const URL = "http://localhost:5000";

const defaultMessage: ChatState = {
  activeChatId: "Chat_1",
  chats: {
    Chat_1: [
      {
        sender: "bot",
        text: "Hello! How can I help you today?",
        time: Date.now(),
      },
    ],
  },
};

export default function Chatbot() {
  const socketsRef = useRef<Record<string, Socket>>({});
  const [isDark, setIsDark] = useState(
    () =>
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  const [messages, setMessages] = useState(defaultMessage);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<any>(null);
  const [activeChat, setActiveChat] = useState(messages.activeChatId);

  const createSocketForChat = (chatId: string) => {
    const socket: Socket = io(URL, { transports: ["websocket"] });
    socket.on("connect", () => {
      console.log(`Socket connected for ${chatId}`);
    }); 
    socket.on("bot_message", (data: any) => {
      if (!socket.connected) {
        alert("App Crashed");
      }
      setLoading(false);
      setMessages((prev) => ({
        ...prev,
        chats: {
          ...prev.chats,
          [chatId]: [
            ...prev.chats[chatId],
            {
              sender: "bot",
              text: data.reply,
              time: Date.now(),
            },
          ],
        },
      }));
    });
    socket.on("disconnect", () => {
      console.log(`Socket disconnected for ${chatId}`);
    });
    socketsRef.current[chatId] = socket;
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  useEffect(() => {
    createSocketForChat("Chat_1");
    return () => {
      Object.values(socketsRef.current).forEach((socket) =>
        socket.disconnect()
      );
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => ({
      ...prev,
      chats: {
        ...prev.chats,
        [prev.activeChatId]: [
          ...prev.chats[prev.activeChatId],
          {
            sender: "user",
            text: input,
            time: Date.now(),
          },
        ],
      },
    }));
    const currentSocket = socketsRef.current[messages.activeChatId];
    if (currentSocket) {
      currentSocket.emit("user_message", input);
    }
    setLoading(true);
    setInput("");
  };

  const addNewChat = () => {
    setMessages((prev) => {
      let newChatId = `Chat_${Object.keys(prev.chats).length + 1}`;
      setActiveChat(newChatId);
      createSocketForChat(newChatId);

      return {
        ...prev,
        activeChatId: newChatId,
        chats: {
          ...prev.chats,
          [newChatId]: [
            {
              sender: "bot",
              text: "Hello! How can I help you today?",
              time: Date.now(),
            },
          ],
        },
      };
    });
  };

  const updateActiveChat = (val: string) => {
    setMessages((prev) => ({ ...prev, activeChatId: val }));
    setActiveChat(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setMessages((prev) => ({
        ...prev,
        chats: {
          ...prev.chats,
          [prev.activeChatId]: [
            ...prev.chats[prev.activeChatId],
            {
              sender: "user",
              text: `📄 Sent file: ${file.name}`,
              time: Date.now(),
            },
          ],
        },
      }));

      const formData = new FormData();
      formData.append("pdf", file);

      const currentSocket = socketsRef.current[messages.activeChatId];
      const socketId = currentSocket?.id ?? "";
      formData.append("socketId", socketId);

      try {
        await fetch(`${URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        console.log("✅ PDF uploaded:");
      } catch (err) {
        console.error("❌ Upload failed", err);
      }
    } else {
      alert("Only PDF files are allowed!");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex items-center justify-between min-h-screen bg-[#eee0e0] dark:bg-gray-800">
      <SideBar
        messages={messages}
        newChat={addNewChat}
        activeChatId={activeChat}
        setActiveChatId={updateActiveChat}
      />
      <div className="flex flex-col w-full h-[700px] border border-gray-700 shadow-lg bg-[#eee0e0] dark:bg-gray-800 overflow-hidden">
        <div className="p-4 font-bold text-lg bg-orange-700 text-white flex justify-between">
          <div>Chatbot</div>
          <button onClick={() => setIsDark(!isDark)}>
            {isDark ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
          </button>
        </div>
        <div className="flex-1 w-full md:w-2/3 m-auto overflow-y-auto p-4 space-y-3 bg-stone-100 dark:bg-gray-900 text-white">
          {messages?.chats[activeChat]?.map((msg, idx) => (
            <div
              key={idx}
              className={`flex  ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={` px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                  msg.sender === "user"
                    ? "bg-orange-600 text-white "
                    : `${isDark ? "bg-gray-700" : "bg-[#867d7d]"} text-white`
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading &&
            (!isDark ? (
              <div className="loaderBlack"></div>
            ) : (
              <div className="loaderWhite"></div>
            ))}
          <div ref={chatEndRef} />
        </div>
        <div className="pb-4 px-2 w-full md:w-2/3 m-auto border-gray-700 bg-stone-100 dark:bg-gray-900 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 bg-white text:black dark:bg-gray-700 dark:text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full">
              <Paperclip size={20} />
            </div>
          </label>

          <button
            onClick={sendMessage}
            className="bg-orange-600 hover:bg-blue-700 text-white p-2 rounded-full"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
