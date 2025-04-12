const axios = require("axios");
require("dotenv").config();

class AIService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    this.huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
  }

  /**
   * Process a message using the appropriate AI model based on context rules
   * @param {string} message - The user's message
   * @param {Object} contextRule - The context rule to apply
   * @returns {Promise<string>} - The AI response
   */
  async processMessage(message, contextRule) {
    try {
      // Check if message is within allowed context
      const isWithinContext = await this.checkMessageContext(
        message,
        contextRule,
      );

      if (!isWithinContext) {
        return this.generateContextBoundaryResponse(contextRule);
      }

      // Select AI model based on context rule
      const aiModel = contextRule?.ai_model || "gemini";

      // Get prompt template from context rule or use default
      const promptTemplate =
        contextRule?.prompt_template ||
        "You are an AI assistant. Please provide information about the following query: {{message}}";

      // Replace placeholders in prompt template
      const prompt = promptTemplate
        .replace("{{message}}", message)
        .replace(
          "{{businessContext}}",
          contextRule?.business_context || "general",
        );

      // Route to appropriate AI model
      switch (aiModel) {
        case "huggingface":
          return await this.generateHuggingFaceResponse(prompt);
        case "grok":
          return await this.generateGrokResponse(prompt);
        case "gemini":
        default:
          return await this.generateGeminiResponse(prompt);
      }
    } catch (error) {
      console.error("Error processing message with AI:", error);
      return "I apologize, but I encountered an error processing your request. Please try again later.";
    }
  }

  /**
   * Check if a message is within the allowed context based on rules
   * @param {string} message - The user's message
   * @param {Object} contextRule - The context rule to apply
   * @returns {Promise<boolean>} - Whether the message is within context
   */
  async checkMessageContext(message, contextRule) {
    // If no context rule or no allowed/restricted topics, assume within context
    if (
      !contextRule ||
      (!contextRule.allowed_topics?.length &&
        !contextRule.restricted_topics?.length)
    ) {
      return true;
    }

    const lowerMessage = message.toLowerCase();

    // Check for restricted topics first (blocklist approach)
    if (contextRule.restricted_topics?.length) {
      for (const topic of contextRule.restricted_topics) {
        if (lowerMessage.includes(topic.toLowerCase())) {
          return false;
        }
      }
    }

    // If there are allowed topics (allowlist approach), check if message contains any
    if (contextRule.allowed_topics?.length) {
      // If no allowed topics are found in the message, it's out of context
      return contextRule.allowed_topics.some((topic) =>
        lowerMessage.includes(topic.toLowerCase()),
      );
    }

    // If we have restricted topics but no allowed topics, and no restricted topics were found,
    // then the message is within context
    return true;
  }

  /**
   * Generate a response when the message is outside the allowed context
   * @param {Object} contextRule - The context rule
   * @returns {string} - The boundary response
   */
  generateContextBoundaryResponse(contextRule) {
    const businessContext = contextRule?.business_context || "general";
    const allowedTopics = contextRule?.allowed_topics || [];

    return `I'm sorry, but I'm currently configured to only respond to queries related to ${businessContext}. ${allowedTopics.length ? `Some topics I can help with include: ${allowedTopics.join(", ")}. ` : ""}Please try asking something related to these topics.`;
  }

  /**
   * Generate a response using the Gemini API
   * @param {string} prompt - The formatted prompt
   * @returns {Promise<string>} - The AI response
   */
  async generateGeminiResponse(prompt) {
    try {
      if (!this.geminiApiKey) {
        return this.generateFallbackResponse(prompt);
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`;

      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      return responseText;
    } catch (error) {
      console.error("Error generating Gemini response:", error);
      return this.generateFallbackResponse(prompt);
    }
  }

  /**
   * Generate a response using the Hugging Face API
   * @param {string} prompt - The formatted prompt
   * @returns {Promise<string>} - The AI response
   */
  async generateHuggingFaceResponse(prompt) {
    try {
      if (!this.huggingfaceApiKey) {
        return this.generateFallbackResponse(prompt);
      }

      // Use a suitable model from Hugging Face
      const model = "mistralai/Mistral-7B-Instruct-v0.2";

      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${this.huggingfaceApiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data[0].generated_text;
    } catch (error) {
      console.error("Error generating Hugging Face response:", error);
      return this.generateFallbackResponse(prompt);
    }
  }

  /**
   * Generate a response using the Grok API (placeholder for future implementation)
   * @param {string} prompt - The formatted prompt
   * @returns {Promise<string>} - The AI response
   */
  async generateGrokResponse(prompt) {
    // This is a placeholder for Grok API integration
    // Since Grok API isn't publicly available yet, we'll fall back to Gemini
    try {
      return await this.generateGeminiResponse(`[Grok Mode] ${prompt}`);
    } catch (error) {
      console.error("Error generating Grok response:", error);
      return this.generateFallbackResponse(prompt);
    }
  }

  /**
   * Generate a fallback response when AI APIs are unavailable
   * @param {string} prompt - The original prompt
   * @returns {string} - A fallback response
   */
  generateFallbackResponse(prompt) {
    // Extract the query from the prompt
    const queryMatch =
      prompt.match(/query: (.+)$/) || prompt.match(/following query: (.+)$/);
    const query = queryMatch ? queryMatch[1] : "your question";

    return `I understand you're asking about ${query}. However, I'm currently unable to access my AI services. Please try again later or contact support if this issue persists.`;
  }
}

module.exports = new AIService();
