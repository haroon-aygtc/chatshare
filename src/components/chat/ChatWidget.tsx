import { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/hooks/useSocket";
import { useChat } from "@/hooks/useChat";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  businessContext?: string;
}

export interface ChatWidgetProps {
  initialMessages?: ChatMessage[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  title?: string;
  primaryColor?: string;
  businessContext?: string;
  apiEndpoint?: string;
  onClose?: () => void;
  embedded?: boolean;
}

const ChatWidget = ({
  initialMessages = [],
  position = "bottom-right",
  title = "Chat Support",
  primaryColor = "#3b82f6",
  businessContext = "general",
  apiEndpoint = "/api/chat",
  onClose,
  embedded = false,
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, connected } = useSocket();
  const { messages, isLoading, sendMessage, roomId, initializeChat } = useChat(
    initialMessages,
    businessContext,
    apiEndpoint,
  );

  // Initialize chat session when component mounts
  useEffect(() => {
    initializeChat();
  }, []);

  // Join socket room when roomId is available
  useEffect(() => {
    if (socket && connected && roomId) {
      socket.emit("join_room", roomId);
    }
  }, [socket, connected, roomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  // If embedded, don't show the toggle button
  if (!isOpen && !embedded) {
    return (
      <button
        onClick={toggleWidget}
        className={`fixed ${positionClasses[position]} z-50 p-4 rounded-full shadow-lg`}
        style={{ backgroundColor: primaryColor }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  // Apply different styles if embedded
  const containerClasses = embedded
    ? "w-full h-full flex flex-col bg-white rounded-lg"
    : `fixed ${positionClasses[position]} z-50 flex flex-col bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out`;

  const containerStyles = embedded
    ? {}
    : {
        width: "350px",
        height: isMinimized ? "60px" : "500px",
        maxHeight: "80vh",
      };

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 rounded-t-lg"
        style={{ backgroundColor: primaryColor }}
      >
        <h3 className="font-medium text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          {!embedded && (
            <button
              onClick={toggleMinimize}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          )}
          {!embedded && (
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat content */}
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">
                    Hello! How can I assist you today?
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/70",
                    )}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted text-muted-foreground max-w-[80%] rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="p-3 border-t">
            <div className="flex items-end space-x-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-10 w-10"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
