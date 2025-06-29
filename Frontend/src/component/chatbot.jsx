import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonal, Paperclip } from 'lucide-react';
import { io } from 'socket.io-client';

// const URL = "http://localhost:5000";
const URL = "https://chatbot-production-2562.up.railway.app";

// const socket = io(URL, {
//   transports: ["websocket"],
// });
const socket = io(URL, {
  transports: ["websocket"],
});

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  useEffect(() => {
    socket.on('bot_message', (data) => {
        console.log(data)
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    });

    return () => {
      socket.off('bot_message');
    };
  }, []);

  const sendMessage = () => {
      console.log(process.env)
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    socket.emit('user_message', input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setMessages((prev) => [...prev, { sender: 'user', text: `📄 Sent file: ${file.name}` }]);

       const formData = new FormData();
        formData.append('pdf', file);
        formData.append("socketId", socket.id);

        try {
          const res = await fetch(`${URL}/api/upload`, {
            method: 'POST',
            body: formData,
          });

          // const data = await res.json();
          console.log('✅ PDF uploaded:');
    } catch (err) {
      console.error('❌ Upload failed', err);
    }
    } else {
      alert('Only PDF files are allowed!');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col w-full max-w-3xl h-[700px] border border-gray-700 rounded-2xl shadow-lg bg-gray-800 overflow-hidden">
        <div className="p-4 font-bold text-lg bg-blue-700 text-white">Chatbot</div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 text-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Hidden file input */}
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
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
          >
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
