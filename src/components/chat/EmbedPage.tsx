import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatWidget from "./ChatWidget";

const EmbedPage = () => {
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState({
    businessContext: "general",
    title: "Chat Support",
    primaryColor: "#3b82f6",
    position: "bottom-right" as
      | "bottom-right"
      | "bottom-left"
      | "top-right"
      | "top-left",
    apiEndpoint: "/api/chat",
    webComponent: false,
  });

  useEffect(() => {
    // Parse configuration from URL parameters
    const businessContext = searchParams.get("businessContext") || "general";
    const title = searchParams.get("title") || "Chat Support";
    const primaryColor = searchParams.get("primaryColor") || "3b82f6";
    const position = searchParams.get("position") || "bottom-right";
    const webComponent = searchParams.get("webComponent") === "true";

    setConfig({
      businessContext,
      title,
      primaryColor: `#${primaryColor.replace("#", "")}`,
      position: position as
        | "bottom-right"
        | "bottom-left"
        | "top-right"
        | "top-left",
      apiEndpoint: "/api/chat",
      webComponent,
    });

    // Set styles for embedded mode
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "transparent";

    // Communicate height changes to parent if in web component mode
    if (webComponent) {
      const sendHeightToParent = () => {
        window.parent.postMessage(
          { type: "resize", height: document.body.scrollHeight },
          "*",
        );
      };

      window.addEventListener("resize", sendHeightToParent);
      // Send initial height
      setTimeout(sendHeightToParent, 100);

      return () => window.removeEventListener("resize", sendHeightToParent);
    }
  }, [searchParams]);

  return (
    <div className="embed-container">
      <ChatWidget
        businessContext={config.businessContext}
        title={config.title}
        primaryColor={config.primaryColor}
        position="bottom-right" // Position is handled by the container in embed mode
        apiEndpoint={config.apiEndpoint}
        embedded={true}
      />
    </div>
  );
};

export default EmbedPage;
