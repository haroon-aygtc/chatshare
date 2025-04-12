import React, { useEffect } from "react";
import ChatWidget, { ChatMessage } from "./ChatWidget";

export interface EmbeddableWidgetProps {
  businessContext?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  title?: string;
  primaryColor?: string;
  apiEndpoint?: string;
  initialMessages?: ChatMessage[];
}

const EmbeddableWidget: React.FC<EmbeddableWidgetProps> = ({
  businessContext = "general",
  position = "bottom-right",
  title = "Chat Support",
  primaryColor = "#3b82f6",
  apiEndpoint = "/api/chat",
  initialMessages = [],
}) => {
  // Generate a unique user ID if not already present
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem(
        "userId",
        `user-${Math.random().toString(36).substring(2, 9)}`,
      );
    }
  }, []);

  return (
    <ChatWidget
      businessContext={businessContext}
      position={position}
      title={title}
      primaryColor={primaryColor}
      apiEndpoint={apiEndpoint}
      initialMessages={initialMessages}
    />
  );
};

export default EmbeddableWidget;
