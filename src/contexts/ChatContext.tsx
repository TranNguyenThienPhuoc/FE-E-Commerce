import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket, ServerMessage } from '@/hooks/useWebSocket';

/**
 * ChatContextType
 * 
 * Defines the shape of the chat context, providing access to the 
 * WebSocket connection state and messaging capabilities.
 */
interface ChatContextType {
  /** Whether the WebSocket connection is currently active */
  isConnected: boolean;
  /** List of messages received from the server */
  messages: ServerMessage[];
  /** Function to send a direct message to another user */
  sendMessage: (toUserId: string, content: string) => boolean;
  /** Function to clear the local message history */
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * ChatProvider Component
 * 
 * Wraps the application (or a part of it) to provide a single, 
 * persistent WebSocket connection. This prevents multiple connections 
 * from being opened when different components use chat features.
 */
export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useWebSocket();

  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * useChat Hook
 * 
 * Custom hook to consume the ChatContext.
 * 
 * @returns {ChatContextType} The chat context value
 * @throws {Error} If used outside of a ChatProvider
 */
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}