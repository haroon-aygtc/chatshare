/**
 * Lightweight Chat Widget Loader (<5KB)
 * This script can be added to any website to load the embeddable chat widget
 */

(function () {
  // Configuration with defaults that can be overridden
  const defaultConfig = {
    businessContext: "general",
    position: "bottom-right",
    title: "Chat Support",
    primaryColor: "#3b82f6",
    apiEndpoint: "https://api.example.com/chat", // Replace with actual API endpoint
    integrationMethod: "iframe", // 'iframe' or 'web-component'
  };

  // Merge user config with defaults
  const initChat = (userConfig = {}) => {
    const config = { ...defaultConfig, ...userConfig };

    if (config.integrationMethod === "iframe") {
      createIframeWidget(config);
    } else {
      createWebComponent(config);
    }
  };

  // Create iframe-based widget
  const createIframeWidget = (config) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.border = "none";
    iframe.style.width = "350px";
    iframe.style.height = "500px";
    iframe.style.maxHeight = "80vh";
    iframe.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
    iframe.style.borderRadius = "8px";
    iframe.style.zIndex = "9999";

    // Set position based on config
    switch (config.position) {
      case "bottom-right":
        iframe.style.bottom = "20px";
        iframe.style.right = "20px";
        break;
      case "bottom-left":
        iframe.style.bottom = "20px";
        iframe.style.left = "20px";
        break;
      case "top-right":
        iframe.style.top = "20px";
        iframe.style.right = "20px";
        break;
      case "top-left":
        iframe.style.top = "20px";
        iframe.style.left = "20px";
        break;
    }

    // Construct URL with config parameters
    const params = new URLSearchParams({
      businessContext: config.businessContext,
      title: config.title,
      primaryColor: config.primaryColor.replace("#", ""),
      embed: "true",
    }).toString();

    iframe.src = `${config.apiEndpoint}/embed?${params}`;
    document.body.appendChild(iframe);

    return iframe;
  };

  // Create web component (Shadow DOM) widget
  const createWebComponent = (config) => {
    // Check if custom elements are supported
    if (!("customElements" in window)) {
      console.error(
        "Custom Elements not supported in this browser. Falling back to iframe.",
      );
      return createIframeWidget(config);
    }

    // Define the custom element if not already defined
    if (!customElements.get("chat-widget")) {
      class ChatWidget extends HTMLElement {
        constructor() {
          super();
          this.config = config;
          this.attachShadow({ mode: "open" });
        }

        connectedCallback() {
          this.render();
        }

        render() {
          // Create a container for the widget
          const container = document.createElement("div");
          container.style.position = "fixed";
          container.style.width = "350px";
          container.style.height = "500px";
          container.style.maxHeight = "80vh";
          container.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
          container.style.borderRadius = "8px";
          container.style.zIndex = "9999";
          container.style.backgroundColor = "#ffffff";
          container.style.display = "flex";
          container.style.flexDirection = "column";
          container.style.overflow = "hidden";

          // Set position based on config
          switch (this.config.position) {
            case "bottom-right":
              container.style.bottom = "20px";
              container.style.right = "20px";
              break;
            case "bottom-left":
              container.style.bottom = "20px";
              container.style.left = "20px";
              break;
            case "top-right":
              container.style.top = "20px";
              container.style.right = "20px";
              break;
            case "top-left":
              container.style.top = "20px";
              container.style.left = "20px";
              break;
          }

          // Create header
          const header = document.createElement("div");
          header.style.padding = "12px";
          header.style.backgroundColor = this.config.primaryColor;
          header.style.color = "#ffffff";
          header.style.fontFamily = "sans-serif";
          header.style.fontWeight = "bold";
          header.style.display = "flex";
          header.style.justifyContent = "space-between";
          header.style.alignItems = "center";
          header.style.borderTopLeftRadius = "8px";
          header.style.borderTopRightRadius = "8px";

          const title = document.createElement("span");
          title.textContent = this.config.title;
          header.appendChild(title);

          // Close button
          const closeBtn = document.createElement("button");
          closeBtn.innerHTML = "&times;";
          closeBtn.style.background = "none";
          closeBtn.style.border = "none";
          closeBtn.style.color = "#ffffff";
          closeBtn.style.fontSize = "20px";
          closeBtn.style.cursor = "pointer";
          closeBtn.style.padding = "0";
          closeBtn.style.lineHeight = "1";
          closeBtn.addEventListener("click", () => {
            container.style.display = "none";
          });
          header.appendChild(closeBtn);

          container.appendChild(header);

          // Create iframe for the actual chat content
          const chatFrame = document.createElement("iframe");
          chatFrame.style.border = "none";
          chatFrame.style.width = "100%";
          chatFrame.style.height = "100%";
          chatFrame.style.backgroundColor = "#ffffff";

          // Construct URL with config parameters
          const params = new URLSearchParams({
            businessContext: this.config.businessContext,
            title: this.config.title,
            primaryColor: this.config.primaryColor.replace("#", ""),
            embed: "true",
            webComponent: "true",
          }).toString();

          chatFrame.src = `${this.config.apiEndpoint}/embed?${params}`;
          container.appendChild(chatFrame);

          this.shadowRoot.appendChild(container);
        }
      }

      customElements.define("chat-widget", ChatWidget);
    }

    // Create and add the custom element to the page
    const widget = document.createElement("chat-widget");
    document.body.appendChild(widget);

    return widget;
  };

  // Expose the init function globally
  window.EmbeddableChat = {
    init: initChat,
  };
})();
