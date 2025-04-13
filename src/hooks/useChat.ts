import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/components/chat/ChatWidget";
import { useSocket } from "./useSocket";
import { chatApi } from "@/services/api";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  handleFollowUpSelection: (question: string) => void;
  roomId: string | null;
  initializeChat: () => Promise<void>;
}

export const useChat = (
  initialMessages: ChatMessage[] = [],
  businessContext: string = "general",
  apiEndpoint: string = "/api/chat",
): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { socket, connected } = useSocket();

  // Initialize chat session
  const initializeChat = useCallback(async () => {
    try {
      // Generate a unique user ID if not already present
      if (!localStorage.getItem("userId")) {
        localStorage.setItem(
          "userId",
          `user-${Math.random().toString(36).substring(2, 9)}`,
        );
      }

      const userId = localStorage.getItem("userId") || "anonymous";

      const { session } = await chatApi.createSession(userId, businessContext);
      setRoomId(session.roomId);

      // Load previous messages if any
      if (session.roomId) {
        try {
          const messagesData = await chatApi.getMessages(session.roomId);
          if (messagesData.messages && messagesData.messages.length > 0) {
            setMessages(messagesData.messages);
          }
        } catch (err) {
          console.error("Error loading messages:", err);
          // Continue even if message loading fails
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      console.error("Error initializing chat:", err);
    }
  }, [businessContext]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const messagesContainer = document.querySelector(".scroll-area-viewport");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !connected) return;

    const handleReceiveMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      if (message.role === "assistant") {
        setIsLoading(false);
      }
      scrollToBottom();
    };

    const handleError = (err: { message: string }) => {
      setError(new Error(err.message));
      setIsLoading(false);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("error", handleError);
    };
  }, [socket, connected]);

  // Handle follow-up question selection
  const handleFollowUpSelection = useCallback((question: string) => {
    sendMessage(question);
  }, []);

  // Send message function
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setIsLoading(true);

      // Create user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        role: "user",
        timestamp: new Date(),
        businessContext,
      };

      // Add user message to state
      setMessages((prev) => [...prev, userMessage]);

      // Add a loading message that will be replaced with the actual response
      const loadingMessageId = uuidv4();
      const loadingMessage: ChatMessage = {
        id: loadingMessageId,
        content: "Thinking...",
        role: "assistant",
        timestamp: new Date(),
        businessContext,
        isLoading: true,
      };

      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const userId = localStorage.getItem("userId") || "anonymous";

        // If socket is connected, send via socket
        if (socket && connected && roomId) {
          socket.emit("send_message", {
            roomId,
            message: content,
            userId,
            businessContext,
          });
          // The response will come through the socket event listener
        } else {
          // Fallback to REST API
          await chatApi.sendMessage(roomId!, content, userId, businessContext);

          // Since we're using REST, we need to manually fetch the AI response
          // In a real implementation, this would be handled by the server
          // and sent back via socket or as part of the response

          // Remove the loading message
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== loadingMessageId),
          );
          setIsLoading(false);
        }
      } catch (err) {
        // Remove the loading message
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessageId),
        );

        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
        console.error("Error sending message:", err);
      }
    },
    [socket, connected, roomId, isLoading, businessContext],
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    handleFollowUpSelection,
    roomId,
    initializeChat,
  };
};
