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
  formattedContent?: {
    title?: string;
    intro?: string;
    content?: string;
    content_blocks?: Array<{ title: string; content: string }>;
    faq?: Array<{ question: string; answer: string }>;
    actions?: Array<{ label: string; url: string }>;
    disclaimer?: string;
    sources?: Array<{ title: string; id: string }>;
    followUpQuestions?: Array<{ id: string; question: string }>;
  };
  isLoading?: boolean;
}

export interface ChatWidgetProps {
  initialMessages?: ChatMessage[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  title?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  borderRadius?: number;
  iconSize?: number;
  logoUrl?: string;
  businessContext?: string;
  apiEndpoint?: string;
  onClose?: () => void;
  embedded?: boolean;
  placeholderText?: string;
  loadingText?: string;
  showBranding?: boolean;
  showTimestamp?: boolean;
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
  secondaryColor,
  fontFamily,
  borderRadius,
  iconSize,
  logoUrl,
  placeholderText,
  loadingText,
  showBranding = true,
  showTimestamp = true,
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, connected } = useSocket();
  const {
    messages,
    isLoading,
    sendMessage,
    roomId,
    initializeChat,
    handleFollowUpSelection,
  } = useChat(initialMessages, businessContext, apiEndpoint);

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
        style={{
          backgroundColor: primaryColor,
          width: `${iconSize || 40}px`,
          height: `${iconSize || 40}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
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
    : `fixed ${positionClasses[position]} z-50 flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out`;

  const containerStyles = embedded
    ? {}
    : {
        width: "350px",
        height: isMinimized ? "60px" : "500px",
        maxHeight: "80vh",
        borderRadius: `${borderRadius || 8}px`,
        fontFamily: fontFamily || "inherit",
      };

  return (
    <div className={containerClasses} style={containerStyles}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 rounded-t-lg"
        style={{
          backgroundColor: primaryColor,
          borderTopLeftRadius: `${borderRadius || 8}px`,
          borderTopRightRadius: `${borderRadius || 8}px`,
        }}
      >
        <div className="flex items-center gap-2">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-6 w-auto object-contain"
            />
          )}
          <h3 className="font-medium text-white">{title}</h3>
        </div>
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
                  {message.role === "user" ? (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  ) : message.formattedContent ? (
                    <div className="space-y-3">
                      {/* Branded header with logo and title */}
                      {showBranding && (
                        <div className="flex items-center space-x-2 border-b pb-2">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt="Logo"
                              className="w-6 h-6 rounded-full object-contain"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                              {businessContext.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <h3 className="font-medium">
                            {message.formattedContent.title || businessContext}
                          </h3>
                        </div>
                      )}

                      {/* Introduction text */}
                      {message.formattedContent.intro && (
                        <p className="text-sm italic">
                          {message.formattedContent.intro}
                        </p>
                      )}

                      {/* Main content */}
                      {message.formattedContent.content && (
                        <div className="whitespace-pre-wrap break-words">
                          {message.formattedContent.content}
                        </div>
                      )}

                      {/* Content blocks */}
                      {message.formattedContent.content_blocks &&
                        message.formattedContent.content_blocks.length > 0 && (
                          <div className="space-y-2">
                            {message.formattedContent.content_blocks.map(
                              (block, index) => (
                                <div key={index} className="space-y-1">
                                  <h4 className="font-medium text-sm">
                                    {block.title}
                                  </h4>
                                  <p className="text-sm">{block.content}</p>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      {/* FAQ section */}
                      {message.formattedContent.faq &&
                        message.formattedContent.faq.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">
                              Frequently Asked Questions
                            </h4>
                            {message.formattedContent.faq.map((item, index) => (
                              <div key={index} className="space-y-1">
                                <p className="font-medium text-sm">
                                  {item.question}
                                </p>
                                <p className="text-sm">{item.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Action buttons */}
                      {message.formattedContent.actions &&
                        message.formattedContent.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.formattedContent.actions.map(
                              (action, index) => (
                                <a
                                  key={index}
                                  href={action.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 py-2"
                                >
                                  {action.label}
                                </a>
                              ),
                            )}
                          </div>
                        )}

                      {/* Sources */}
                      {message.formattedContent.sources &&
                        message.formattedContent.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Sources:
                            </p>
                            <ul className="text-xs text-muted-foreground list-disc pl-4">
                              {message.formattedContent.sources.map(
                                (source, index) => (
                                  <li key={index}>{source.title}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Follow-up questions */}
                      {message.formattedContent.followUpQuestions &&
                        message.formattedContent.followUpQuestions.length >
                          0 && (
                          <div className="mt-3 pt-2 border-t border-border">
                            <p className="text-xs font-medium mb-2">
                              Follow-up questions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.formattedContent.followUpQuestions.map(
                                (q) => (
                                  <button
                                    key={q.id}
                                    onClick={() =>
                                      handleFollowUpSelection(q.question)
                                    }
                                    className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                                  >
                                    {q.question}
                                  </button>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {/* Disclaimer */}
                      {message.formattedContent.disclaimer && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {message.formattedContent.disclaimer}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  )}
                  {showTimestamp && (
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
                  )}
                </div>
              ))}
              {messages.some((msg) => msg.isLoading) && (
                <div className="bg-muted text-muted-foreground max-w-[80%] rounded-lg p-3">
                  {showBranding && (
                    <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="w-6 h-6 rounded-full object-contain"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {businessContext.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <h3 className="font-medium">
                        {businessContext.charAt(0).toUpperCase() +
                          businessContext.slice(1)}{" "}
                        Assistant
                      </h3>
                    </div>
                  )}
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
                placeholder={placeholderText || "Type your message..."}
                className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                style={{ backgroundColor: secondaryColor }}
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
