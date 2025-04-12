import { useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";

interface ChatPageProps {
  businessContext?: string;
  title?: string;
  apiEndpoint?: string;
}

const ChatPage = ({
  businessContext = "general",
  title = "AI Chat Assistant",
  apiEndpoint = "/api/chat",
}: ChatPageProps) => {
  const { messages, isLoading, sendMessage, initializeChat } = useChat(
    [],
    businessContext,
    apiEndpoint,
  );

  const [inputValue, setInputValue] = useState("");

  // Initialize chat when component mounts
  useEffect(() => {
    // Generate a unique user ID if not already present
    if (!localStorage.getItem("userId")) {
      localStorage.setItem(
        "userId",
        `user-${Math.random().toString(36).substring(2, 9)}`,
      );
    }

    initializeChat();
  }, [initializeChat]);

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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>

      {/* Chat content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to the AI Chat Assistant
                </h2>
                <p className="text-muted-foreground mb-4">
                  Ask me anything, and I'll do my best to help you with your
                  questions.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} rounded-lg p-4`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <div
                  className={`text-xs mt-1 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="bg-muted text-muted-foreground max-w-[80%] rounded-lg p-4">
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
          </div>
        </ScrollArea>
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto flex items-end space-x-2">
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
    </div>
  );
};

export default ChatPage;
