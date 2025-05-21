import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Layout from "../components/Layout";
import { Send, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createConversation,
  saveMessage,
  getConversationMessages,
  generateAIResponse,
  saveConversationToSessionStorage,
  getConversationFromSessionStorage,
} from "@/services/chatService";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 사주와 관련된 질문이 있으시면 언제든지 물어보세요. 어떤 도움이 필요하신가요?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load conversation data on component mount
  useEffect(() => {
    const loadConversation = async () => {
      if (user) {
        // For authenticated users, create or load conversation from the database
        const convId = await createConversation();
        if (convId) {
          setConversationId(convId);
          const storedMessages = await getConversationMessages(convId);
          if (storedMessages.length > 0) {
            setMessages(storedMessages);
            setMessageCount(
              storedMessages.filter((msg) => msg.sender === "user").length
            );
          }
        }
      } else {
        // For non-authenticated users, load from session storage
        const storedMessages = getConversationFromSessionStorage();
        setMessages(storedMessages);
        setMessageCount(
          storedMessages.filter((msg) => msg.sender === "user").length
        );
      }
    };

    loadConversation();
  }, [user]);

  // Save messages to storage when they change
  useEffect(() => {
    if (messages.length > 1) {
      if (!user) {
        // For non-authenticated users, save to session storage
        saveConversationToSessionStorage(messages);
      }
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    } else {
      setIsInitialLoad(false);
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Check if user has reached the free message limit
    if (messageCount >= 5 && !user) {
      toast({
        title: "무료 체험 한도 초과",
        description: "더 많은 질문을 하시려면 로그인이 필요합니다.",
      });
      return;
    }

    // Generate a unique ID for the user message
    const userMessageId = Date.now().toString();

    // Add user message to the UI
    const userMessage: Message = {
      id: userMessageId,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setMessageCount((prev) => prev + 1);

    // If authenticated, save the message to the database
    if (user && conversationId) {
      await saveMessage(conversationId, userMessage.text, "user");
    }

    try {
      // Generate AI response
      const botResponse = await generateAIResponse(inputMessage);

      // Generate a unique ID for the bot message
      const botMessageId = (Date.now() + 1).toString();

      // Add bot response to the UI
      const botMessage: Message = {
        id: botMessageId,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);

        // If authenticated, save the bot message to the database
        if (user && conversationId) {
          saveMessage(conversationId, botMessage.text, "bot");
        }
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      console.error("Error generating response:", error);
      toast({
        title: "오류 발생",
        description:
          "응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-lavender/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-indigo">AI 사주 상담</h1>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 flex flex-col h-[calc(100vh-280px)]">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.sender === "user"
                        ? "bg-indigo text-white rounded-tr-none"
                        : "bg-lavender/40 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-indigo-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-lavender/40 text-gray-800 rounded-xl rounded-tl-none p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="질문을 입력하세요..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-indigo"
              />
              <button
                type="submit"
                className="bg-indigo text-white p-3 rounded-lg hover:bg-deep-indigo transition-colors"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              {user
                ? "무제한 질문 가능"
                : `무료 체험: ${Math.max(
                    0,
                    5 - messageCount
                  )}회 질문 남음 (이후 구독 필요)`}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
