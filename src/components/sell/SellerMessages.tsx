import React, { useState, useEffect, useMemo, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send, User, MessageSquare, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

/**
 * SellerMessages Component
 * 
 * A real-time messaging interface for sellers to communicate with buyers.
 * Features a conversation list sidebar and a main chat window.
 * Integrated with the application's theme and design system.
 */
export const SellerMessages: React.FC = () => {
  const { messages, sendMessage, isConnected } = useChat();
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync incoming messages from the global ChatContext to local state grouped by user
  useEffect(() => {
    if (!user) return;

    setLocalMessages((prevGroups) => {
      const newGroups = { ...prevGroups };
      let changed = false;

      messages.forEach((msg) => {
        const buyerId = msg.payload.fromUserId;
        
        // Skip messages sent by the current user (they are handled by handleSendReply for immediate feedback)
        if (buyerId === user.id) return;

        if (!newGroups[buyerId]) {
          newGroups[buyerId] = [];
        }

        // Check if message already exists in our local state to avoid duplicates
        const exists = newGroups[buyerId].some((m) => m.id === msg.id);
        if (!exists) {
          newGroups[buyerId].push({
            id: msg.id,
            senderId: buyerId,
            content: msg.payload.content,
            timestamp: msg.payload.timestamp,
            isMe: false,
          });
          changed = true;
        }
      });

      if (changed) {
        // Ensure messages in each conversation are sorted by time
        Object.keys(newGroups).forEach(id => {
          newGroups[id] = [...newGroups[id]].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
        return newGroups;
      }
      return prevGroups;
    });
  }, [messages, user]);

  // Derive the list of conversations for the sidebar
  const conversations = useMemo(() => {
    return Object.entries(localMessages)
      .map(([userId, msgs]) => {
        const lastMsg = msgs[msgs.length - 1];
        return {
          userId,
          lastMessage: lastMsg.content,
          timestamp: lastMsg.timestamp,
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [localMessages]);

  // Auto-scroll to the bottom of the chat when messages update or a conversation is selected
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const timeoutId = setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedUserId, localMessages]);

  const handleSendReply = () => {
    if (!selectedUserId || !replyText.trim() || !user) return;

    // Validation: minimum 10 characters as per system rules
    if (replyText.length < 10) return;

    const success = sendMessage(selectedUserId, replyText);
    if (success) {
      // Optimistically add the message to the local conversation for better UX
      const myMsg: ChatMessage = {
        id: `local-${crypto.randomUUID()}`,
        senderId: user.id,
        content: replyText,
        timestamp: new Date().toISOString(),
        isMe: true,
      };

      setLocalMessages((prev) => ({
        ...prev,
        [selectedUserId]: [...(prev[selectedUserId] || []), myMsg],
      }));
      setReplyText("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-6 overflow-hidden">
      {/* Sidebar: Conversation List */}
      <Card className="w-80 flex flex-col border-border shadow-sm overflow-hidden bg-background">
        <div className="p-4 border-b bg-secondary/30">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2 tracking-tight">
            <MessageSquare size={18} className="text-primary" />
            Hội thoại
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Tìm kiếm người mua..." 
              className="pl-9 bg-background border-border h-10 text-sm focus-visible:ring-primary/20" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <MessageSquare className="text-muted-foreground/40" size={32} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Chưa có tin nhắn</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Khi có người mua liên hệ, hội thoại sẽ xuất hiện tại đây.</p>
              </div>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => setSelectedUserId(conv.userId)}
                className={cn(
                  "w-full p-4 flex items-start gap-3 hover:bg-secondary/50 transition-all border-b border-border text-left relative",
                  selectedUserId === conv.userId && "bg-primary/5 after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12 border border-border shadow-sm">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-background rounded-full shadow-sm",
                    isConnected ? "bg-green-500" : "bg-muted-foreground/30"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-sm text-foreground truncate">
                      Người mua {conv.userId.substring(0, 6)}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate leading-tight">
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Main: Chat Window */}
      <Card className="flex-1 flex flex-col border-border shadow-sm overflow-hidden bg-background">
        {selectedUserId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-secondary/30 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-border shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User size={24} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-foreground tracking-tight">Người mua {selectedUserId.substring(0, 8)}</h3>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full shadow-sm", isConnected ? "bg-green-500 animate-pulse" : "bg-destructive")} />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      {isConnected ? "Trực tuyến" : "Ngoại tuyến"}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs font-bold h-9 px-4 border-primary/20 hover:bg-primary/5">
                Xem hồ sơ
              </Button>
            </div>

            {/* Messages List */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50 scroll-smooth"
            >
              {localMessages[selectedUserId]?.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[75%] space-y-1.5",
                    msg.isMe ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all hover:shadow-md",
                      msg.isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-secondary text-secondary-foreground border border-border rounded-tl-none"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap wrap-break-word">
                      {msg.content}
                    </p>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative group">
                  <Input
                    placeholder="Nhập tin nhắn phản hồi (tối thiểu 10 ký tự)..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    className="bg-muted/30 border-border focus-visible:ring-primary/20 min-h-11 pr-4 transition-colors group-hover:border-primary/30"
                  />
                </div>
                <Button 
                  onClick={handleSendReply} 
                  disabled={!isConnected || replyText.length < 10}
                  className={cn(
                    "h-11 px-6 shadow-lg transition-all",
                    replyText.length >= 10 ? "shadow-primary/20" : "opacity-50"
                  )}
                >
                  <Send size={18} className="mr-2" />
                  Gửi
                </Button>
              </div>
              <div className="mt-3 flex justify-between items-center px-1">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Nhấn Enter để gửi, Shift+Enter để xuống dòng
                </p>
                <span className={cn(
                  "text-[10px] font-bold tracking-tighter",
                  replyText.length > 0 && replyText.length < 10 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {replyText.length}/1000 ký tự
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border border-border shadow-inner">
              <Store size={48} className="text-primary/20" />
            </div>
            <div className="max-w-sm space-y-2">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Trung tâm Tin nhắn Người bán</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Chọn một người mua từ danh sách bên trái để xem tin nhắn và phản hồi các thắc mắc về sản phẩm của bạn.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};