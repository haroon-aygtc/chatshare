import { GoogleAuth } from "google-auth-library";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Initialize Google Auth for Gemini
const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

/**
 * Process a message using the appropriate AI model based on context rules
 * @param {string} message - The user message to process
 * @param {Object} contextRules - The context rules to apply
 * @returns {Promise<string>} - The AI response
 */
export const processMessage = async (message, contextRules) => {
  try {
    // Check if message is within allowed context
    if (!isWithinContext(message, contextRules)) {
      const boundaryResponse = generateContextBoundaryResponse(contextRules);
      return {
        content: boundaryResponse,
        isContextBoundary: true,
      };
    }

    // Search knowledge base for relevant information
    const businessContext = contextRules?.businessContext || "general";
    let knowledgeResults = [];
    let knowledgeContext = "";

    try {
      // Import dynamically to avoid circular dependencies
      const { default: knowledgeService } = await import(
        "../services/knowledge.service.js"
      );
      knowledgeResults = await knowledgeService.searchKnowledgeBase(
        message,
        businessContext,
      );

      // Format knowledge results for inclusion in the prompt
      if (knowledgeResults && knowledgeResults.length > 0) {
        knowledgeContext =
          "\n\nRelevant information from our knowledge base:\n";
        knowledgeResults.forEach((entry, index) => {
          knowledgeContext += `${index + 1}. ${entry.title}: ${entry.content}\n`;
        });
      }
    } catch (error) {
      console.error("Error searching knowledge base:", error);
      // Continue without knowledge base results if there's an error
    }

    // Determine which AI model to use based on context rules
    const aiModel = contextRules?.aiModel || "gemini";

    // Generate prompt using template if available
    let prompt = await generatePrompt(message, contextRules);

    // Add knowledge base information to the prompt if available
    if (knowledgeContext) {
      prompt += knowledgeContext;
      prompt +=
        "\n\nPlease use the above information from our knowledge base to inform your response. Format your response in a clear, professional manner with sections and bullet points where appropriate.";
    }

    // Process with appropriate AI model
    let response;
    switch (aiModel) {
      case "gemini":
        response = await processWithGemini(prompt);
        break;
      case "huggingface":
        response = await processWithHuggingFace(prompt);
        break;
      case "grok":
        // Placeholder for Grok integration
        response = await processWithGemini(prompt); // Fallback to Gemini for now
        break;
      default:
        response = await processWithGemini(prompt);
    }

    // Apply post-processing to ensure response meets context requirements
    const formattedResponse = await postProcessResponse(
      response,
      contextRules,
      knowledgeResults,
    );

    return formattedResponse;
  } catch (error) {
    console.error("Error processing message with AI:", error);
    return {
      content:
        "I apologize, but I encountered an error processing your request. Please try again later.",
      error: true,
    };
  }
};

/**
 * Check if a message is within the allowed context
 * @param {string} message - The message to check
 * @param {Object} contextRules - The context rules to apply
 * @returns {boolean} - Whether the message is within context
 */
const isWithinContext = (message, contextRules) => {
  if (!contextRules || !contextRules.isActive) {
    return true; // No active context rules, allow all messages
  }

  const { allowedTopics, restrictedTopics } = contextRules;

  // Check for restricted topics
  if (restrictedTopics && restrictedTopics.length > 0) {
    for (const topic of restrictedTopics) {
      if (message.toLowerCase().includes(topic.toLowerCase())) {
        return false; // Message contains a restricted topic
      }
    }
  }

  // If no allowed topics are specified, any non-restricted message is allowed
  if (!allowedTopics || allowedTopics.length === 0) {
    return true;
  }

  // Check for allowed topics
  for (const topic of allowedTopics) {
    if (message.toLowerCase().includes(topic.toLowerCase())) {
      return true; // Message contains an allowed topic
    }
  }

  // If allowed topics are specified but none match, message is not within context
  return false;
};

/**
 * Generate a response for when a message is outside context boundaries
 * @param {Object} contextRules - The context rules
 * @returns {string} - The boundary response
 */
const generateContextBoundaryResponse = (contextRules) => {
  const businessContext = contextRules?.businessContext || "general";

  return `I'm sorry, but I can only provide information related to ${businessContext}. Please ask a question related to this topic.`;
};

/**
 * Generate a prompt using the template from context rules and prompt templates
 * @param {string} message - The user message
 * @param {Object} contextRules - The context rules with prompt template
 * @returns {Promise<string>} - The generated prompt
 */
const generatePrompt = async (message, contextRules) => {
  try {
    // First check if there's a template in context rules
    if (contextRules && contextRules.promptTemplate) {
      let prompt = contextRules.promptTemplate;

      // Replace {{message}} placeholder with actual message
      prompt = prompt.replace(/{{message}}/g, message);

      // Replace {{businessContext}} placeholder
      prompt = prompt.replace(
        /{{businessContext}}/g,
        contextRules.businessContext || "general",
      );

      return prompt;
    }

    // If no template in context rules, try to get from database
    const businessContext = contextRules?.businessContext || "general";

    // Import dynamically to avoid circular dependencies
    const { default: PromptTemplate } = await import(
      "../models/PromptTemplate.js"
    );

    // Try to find a default template for this business context
    const defaultTemplate = await PromptTemplate.findOne({
      where: {
        businessContext,
        isDefault: true,
        isActive: true,
      },
    });

    if (defaultTemplate) {
      let prompt = defaultTemplate.template;

      // Replace {{message}} placeholder with actual message
      prompt = prompt.replace(/{{message}}/g, message);

      // Replace {{businessContext}} placeholder
      prompt = prompt.replace(/{{businessContext}}/g, businessContext);

      return prompt;
    }

    // If no template found, just return the message
    return message;
  } catch (error) {
    console.error("Error generating prompt:", error);
    // If there's an error, just return the original message
    return message;
  }
};

/**
 * Process a message with the Gemini API
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The Gemini response
 */
const processWithGemini = async (prompt) => {
  try {
    const client = await auth.getClient();
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const model = "gemini-pro";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const data = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await client.request({
      url,
      method: "POST",
      data,
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error processing with Gemini:", error);
    throw error;
  }
};

/**
 * Process a message with the Hugging Face API
 * @param {string} prompt - The prompt to send to Hugging Face
 * @returns {Promise<string>} - The Hugging Face response
 */
const processWithHuggingFace = async (prompt) => {
  try {
    const model =
      process.env.HUGGINGFACE_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";

    const response = await hf.textGeneration({
      model,
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      },
    });

    return response.generated_text;
  } catch (error) {
    console.error("Error processing with Hugging Face:", error);
    throw error;
  }
};

/**
 * Post-process an AI response to ensure it meets context requirements
 * @param {string} response - The raw AI response
 * @param {Object} contextRules - The context rules to apply
 * @param {Array} knowledgeResults - Knowledge base search results
 * @returns {Promise<Object>} - The processed response with formatting
 */
const postProcessResponse = async (
  response,
  contextRules,
  knowledgeResults = [],
) => {
  try {
    // Get follow-up questions if available
    let followUpQuestions = [];
    try {
      const { default: followupService } = await import(
        "../services/followup.service.js"
      );
      const businessContext = contextRules?.businessContext || "general";
      followUpQuestions =
        await followupService.getFollowUpsByBusinessContext(businessContext);
    } catch (error) {
      console.error("Error getting follow-up questions:", error);
      // Continue without follow-up questions if there's an error
    }

    // Format the response using the response format service
    try {
      const { default: formatService } = await import(
        "../services/format.service.js"
      );
      const businessContext = contextRules?.businessContext || "general";

      // Get the default format for this business context
      const format = await formatService.getDefaultFormat(businessContext);

      // Format the response
      return formatService.formatResponse(
        response,
        format,
        knowledgeResults,
        followUpQuestions,
      );
    } catch (error) {
      console.error("Error formatting response:", error);
      // If formatting fails, return a basic formatted response
      return {
        content: response,
        sources: knowledgeResults.map((entry) => ({
          title: entry.title,
          id: entry.id,
        })),
        followUpQuestions: followUpQuestions,
      };
    }
  } catch (error) {
    console.error("Error in post-processing response:", error);
    // Return a basic response if all else fails
    return {
      content: response,
    };
  }
};

export default {
  processMessage,
};
