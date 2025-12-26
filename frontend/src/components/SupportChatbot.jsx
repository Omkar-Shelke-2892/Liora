import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

export default function SupportChatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 🌿 How are you feeling today? I'm here to listen.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    const user_id = localStorage.getItem("liora_user_id") || "guest";

    // Show user message
    setMessages((prev) => [...prev, { sender: "user", text: userText, timestamp: new Date() }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": user_id
        },
        body: JSON.stringify({ text: userText })
      });

      const data = await res.json();
      const botReply = data.bot || "I'm here with you 💚";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply, timestamp: new Date() }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm feeling a bit disconnected. Let's try again soon 💛", timestamp: new Date() }
      ]);
    }

    setIsTyping(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Support Chatbot</h1>
          <p className="text-lg text-gray-600">Your compassionate AI companion</p>
        </motion.div>

        <motion.div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-teal-100">

          <div className="bg-gradient-to-r from-teal-600 to-green-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-xl">Liora Assistant</h3>
                <span className="text-sm">Always here for you</span>
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end space-x-2`}>
                
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-white text-gray-800 border-2 border-teal-100"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border-2 border-teal-100 px-5 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <motion.div className="w-2 h-2 bg-teal-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                    <motion.div className="w-2 h-2 bg-teal-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 bg-teal-500 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 bg-white border-t-2 border-gray-100">
            <div className="flex gap-3">
              <input
                className={`flex-1 p-4 border-2 rounded-2xl focus:outline-none ${
                  isFocused ? "border-teal-500" : "border-gray-200"
                }`}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className={`px-6 py-4 rounded-2xl font-semibold text-white ${
                  input.trim()
                    ? "bg-gradient-to-r from-teal-600 to-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
