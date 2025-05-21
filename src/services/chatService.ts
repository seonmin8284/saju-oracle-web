import { supabase } from '@/integrations/supabase/client';
import { chatBotResponses } from '../data/dummyData';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type StoredMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
};

export type Conversation = {
  id: string;
  messages: Message[];
  created_at: Date;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Create a new chat conversation for the user
export const createConversation = async (): Promise<string | null> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert([{ user_id: userId }])
      .select();
    
    if (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error in createConversation:', error);
    return null;
  }
};

// Save a message to the database
export const saveMessage = async (
  conversationId: string,
  text: string,
  sender: 'user' | 'bot'
): Promise<string | null> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{
        conversation_id: conversationId,
        user_id: userId,
        user_input: sender === 'user' ? text : null,
        bot_response: sender === 'bot' ? text : null,
        timestamp: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Error saving message:', error);
      return null;
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error in saveMessage:', error);
    return null;
  }
};

// Get all messages for a conversation
export const getConversationMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching conversation messages:', error);
      return [];
    }
    
    return data.map(message => ({
      id: message.id,
      text: message.user_input || message.bot_response || '',
      sender: message.user_input ? 'user' : 'bot',
      timestamp: new Date(message.timestamp)
    }));
  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    return [];
  }
};

// Get all conversations for the current user
export const getUserConversations = async (): Promise<Conversation[]> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user conversations:', error);
      return [];
    }
    
    const conversations: Conversation[] = [];
    
    for (const conversation of data) {
      const messages = await getConversationMessages(conversation.id);
      conversations.push({
        id: conversation.id,
        messages,
        created_at: new Date(conversation.created_at)
      });
    }
    
    return conversations;
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return [];
  }
};

// Generate a response from the AI
export async function generateAIResponse(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        tone: '기본'
      }),
    });

    if (!response.ok) {
      throw new Error('API 응답 오류');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
  }
}

// Store conversation data in session storage for non-authenticated users
export const saveConversationToSessionStorage = (messages: Message[]): void => {
  sessionStorage.setItem('chatMessages', JSON.stringify(messages));
};

export const getConversationFromSessionStorage = (): Message[] => {
  const storedMessages = sessionStorage.getItem('chatMessages');
  
  if (!storedMessages) {
    return [{
      id: '1',
      text: '안녕하세요! 사주와 관련된 질문이 있으시면 언제든지 물어보세요. 어떤 도움이 필요하신가요?',
      sender: 'bot',
      timestamp: new Date()
    }];
  }
  
  try {
    return JSON.parse(storedMessages).map((msg: StoredMessage) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Error parsing stored chat messages:', error);
    return [{
      id: '1',
      text: '안녕하세요! 사주와 관련된 질문이 있으시면 언제든지 물어보세요. 어떤 도움이 필요하신가요?',
      sender: 'bot',
      timestamp: new Date()
    }];
  }
};
