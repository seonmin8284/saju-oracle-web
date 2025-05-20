
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Send, ArrowLeft } from 'lucide-react';
import { chatBotResponses } from '../data/dummyData';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요! 사주와 관련된 질문이 있으시면 언제든지 물어보세요. 어떤 도움이 필요하신가요?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      // Get random response from dummy data
      const randomIndex = Math.floor(Math.random() * chatBotResponses.length);
      const botResponse = chatBotResponses[randomIndex];
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 ${
                      message.sender === 'user'
                        ? 'bg-indigo text-white rounded-tr-none'
                        : 'bg-lavender/40 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'
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
              무료 체험: 5회 질문 (이후 구독 필요)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
