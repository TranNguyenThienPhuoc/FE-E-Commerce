import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Store } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useChat } from "@/contexts/ChatContext";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ContactSellerDialogProps {
  sellerId: string;
  sellerName: string;
  productName: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}

/**
 * ContactSellerDialog Component
 * 
 * Provides a real-time chat interface for users to contact sellers.
 * Uses the useWebSocket hook to send and receive messages.
 * Replaces ScrollArea with a standard div for better control and reliability.
 */
export const ContactSellerDialog: React.FC<ContactSellerDialogProps> = ({
  sellerId,
  sellerName,
  productName,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [localConversation, setLocalConversation] = useState<ChatMessage[]>([]);
  const { sendMessage, messages, isConnected } = useChat();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const newMessages = messages
      .filter(msg => {
        const isFromSeller = msg.payload.fromUserId === sellerId;
        const isToThisSeller = msg.meta?.toUserId === sellerId || 
                             (msg as any).payload?.toUserId === sellerId;
        const isFromMe = msg.payload.fromUserId === user.id;
        
        return isFromSeller || (isFromMe && isToThisSeller);
      })
      .map(msg => ({
        id: msg.id,
        senderId: msg.payload.fromUserId,
        content: msg.payload.content,
        timestamp: msg.payload.timestamp,
        isMe: msg.payload.fromUserId === user.id
      }));

    if (newMessages.length > 0) {
      setLocalConversation(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
        
        if (uniqueNew.length === 0) return prev;
        
        const filteredPrev = prev.filter(localMsg => {
          if (!localMsg.id.startsWith('local-')) return true;
          return !uniqueNew.some(serverMsg => 
            serverMsg.content === localMsg.content && 
            Math.abs(new Date(serverMsg.timestamp).getTime() - new Date(localMsg.timestamp).getTime()) < 5000
          );
        });

        const updated = [...filteredPrev, ...uniqueNew].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        console.log("[ContactSellerDialog] Total messages in conversation:", updated.length);
        return updated;
      });
    }
  }, [messages, sellerId, user]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const timeoutId = setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [localConversation]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    if (message.length < 10) {
      showToast({
        title: "Tin nhắn quá ngắn",
        description: "Vui lòng nhập ít nhất 10 ký tự",
        variant: "error",
      });
      return;
    }

    console.log(`[ContactSellerDialog] Sending message to ${sellerId}: ${message.substring(0, 20)}...`);
    const success = sendMessage(sellerId, message);

    if (success) {
      // Add to local conversation immediately for better UX
      const myMsg: ChatMessage = {
        id: `local-${crypto.randomUUID()}`,
        senderId: user.id,
        content: message,
        timestamp: new Date().toISOString(),
        isMe: true
      };
      setLocalConversation(prev => [...prev, myMsg]);
      setMessage("");
    } else {
      console.error("[ContactSellerDialog] sendMessage returned false");
      showToast({
        title: "Lỗi gửi tin nhắn",
        description: "Không thể kết nối tới máy chủ real-time",
        variant: "error",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !isAuthenticated) {
      showToast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để liên hệ với người bán",
        variant: "error",
        duration: 3000,
      });
      navigate({ to: "/auth/login" });
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-14 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all">
          <MessageSquare size={18} className="text-primary" />
          Liên hệ người bán
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[650px] flex flex-col p-0 gap-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 border-b bg-secondary/30 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-inner">
              <Store size={24} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold tracking-tight">Chat với {sellerName}</DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1">
                <span className="opacity-70">Sản phẩm:</span> 
                <span className="text-foreground truncate max-w-[200px]">{productName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Message List Container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-background scroll-smooth"
        >
          {localConversation.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm space-y-4">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center animate-pulse">
                <MessageSquare size={40} className="text-muted-foreground/40" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-foreground">Chưa có tin nhắn</p>
                <p className="text-xs max-w-[200px] mx-auto leading-relaxed">
                  Hãy gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện với người bán.
                </p>
              </div>
            </div>
          ) : (
            localConversation.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] space-y-1",
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
                <span className="text-[10px] text-muted-foreground px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <div className="relative group">
            <Textarea
              placeholder="Nhập tin nhắn của bạn (tối thiểu 10 ký tự)..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] pr-14 resize-none bg-muted/30 border-border focus-visible:ring-primary/20 transition-colors group-hover:border-primary/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              size="icon"
              onClick={handleSendMessage} 
              disabled={!isConnected || message.length < 10}
              className={cn(
                "absolute bottom-3 right-3 h-10 w-10 rounded-full transition-all shadow-lg",
                message.length >= 10 
                  ? "scale-100 opacity-100 bg-primary hover:bg-primary/90" 
                  : "scale-90 opacity-50 bg-muted"
              )}
            >
              <Send size={18} className={cn(message.length >= 10 ? "text-primary-foreground" : "text-muted-foreground")} />
            </Button>
          </div>
          
          <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <div className={cn(
                "w-2 h-2 rounded-full", 
                isConnected ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-destructive"
              )} />
              <span className={isConnected ? "text-green-600" : "text-destructive"}>
                {isConnected ? "Sẵn sàng" : "Mất kết nối"}
              </span>
            </div>
            <span className={cn(
              "text-[10px]",
              message.length > 0 && message.length < 10 ? "text-destructive font-medium" : "text-muted-foreground"
            )}>
              {message.length}/1000 ký tự
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};