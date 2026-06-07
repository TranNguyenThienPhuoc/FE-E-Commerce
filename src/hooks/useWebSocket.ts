import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";

/**
 * Payload for direct messages received from the server.
 */
export interface DirectMessagePayload {
  fromUserId: string;
  content: string;
  timestamp: string;
}

/**
 * Standard envelope for messages pushed from the server.
 */
export interface ServerMessage {
  type: string;
  id: string;
  payload: DirectMessagePayload;
  meta?: Record<string, any>;
}

/**
 * Schema for messages sent from the client to the server.
 */
export interface ClientMessage {
  type: "direct";
  userId: string;
  toUserId: string;
  content: string;
}

export function useWebSocket() {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  /**
   * Establishes the WebSocket connection.
   * Automatically called when the user is authenticated.
   */
  const connect = useCallback(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.close();
      }
      return;
    }

    // Use environment variable for the WebSocket URL or fallback to localhost
    const baseUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";
    const token = authService.getAccessToken();

    const wsUrl = token
      ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
      : baseUrl;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        if (socketRef.current === ws) {
          console.log("[WebSocket] Connection established");
          setIsConnected(true);
        }
      };

      ws.onmessage = (event) => {
        if (socketRef.current !== ws) return;
        console.log("[WebSocket] Raw message received:", event.data);
        try {
          const data = JSON.parse(event.data);
          console.log("[WebSocket] Parsed data:", data);

          // Handle both "direct" type and potential variations from server
          const messageType = data.type || "direct";
          
          if (messageType === "direct") {
            const serverMsg: ServerMessage = {
              type: "direct",
              id: data.id || crypto.randomUUID(),
              payload: data.payload || {
                fromUserId: data.fromUserId || data.userId || "unknown",
                content: data.content || "",
                timestamp: data.timestamp || new Date().toISOString()
              },
              meta: data.meta
            };
            
            setMessages((prev) => [...prev, serverMsg]);
          } else {
            console.warn("[WebSocket] Received unknown message type:", messageType);
          }
        } catch (err) {
          console.error("[WebSocket] Error parsing message:", err);
        }
      };

      ws.onclose = (event) => {
        if (socketRef.current === ws) {
          setIsConnected(false);
          socketRef.current = null;
        }
        console.log(`[WebSocket] Connection closed: ${event.code} ${event.reason}`);
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
        if (socketRef.current === ws) {
          setIsConnected(false);
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
    }
  }, [isAuthenticated, user]);

  // Handle connection lifecycle
  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  /**
   * Sends a direct message to another user.
   *
   * @param toUserId - The ID of the recipient (e.g., sellerId)
   * @param content - The message content (10-1000 characters)
   * @returns boolean - Whether the message was successfully queued for sending
   */
  const sendMessage = useCallback(
    (toUserId: string, content: string) => {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.warn("[WebSocket] Cannot send message: WebSocket is not connected", {
          readyState: socketRef.current?.readyState,
        });
        return false;
      }

      if (!user) {
        console.warn("Cannot send message: User is not authenticated");
        return false;
      }

      // Validation rules from documentation
      if (content.length < 10) {
        console.warn("Message content is too short (min 10 characters)");
        return false;
      }
      if (content.length > 1000) {
        console.warn("Message content is too long (max 1000 characters)");
        return false;
      }

      const message: ClientMessage = {
        type: "direct",
        userId: user.id,
        toUserId,
        content,
      };

      console.log("[WebSocket] Sending message:", message);
      socketRef.current.send(JSON.stringify(message));
      return true;
    },
    [user],
  );

  /**
   * Clears the local message history.
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    messages,
    sendMessage,
    clearMessages,
  };
}
