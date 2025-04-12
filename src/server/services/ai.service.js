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
      return generateContextBoundaryResponse(contextRules);
    }

    // Determine which AI model to use based on context rules
    const aiModel = contextRules?.aiModel || "gemini";

    // Generate prompt using template if available
    const prompt = generatePrompt(message, contextRules);

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
    return postProcessResponse(response, contextRules);
  } catch (error) {
    console.error("Error processing message with AI:", error);
    return "I apologize, but I encountered an error processing your request. Please try again later.";
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
 * Generate a prompt using the template from context rules
 * @param {string} message - The user message
 * @param {Object} contextRules - The context rules with prompt template
 * @returns {string} - The generated prompt
 */
const generatePrompt = (message, contextRules) => {
  if (!contextRules || !contextRules.promptTemplate) {
    return message; // No template, use message as is
  }

  let prompt = contextRules.promptTemplate;

  // Replace {{message}} placeholder with actual message
  prompt = prompt.replace(/{{message}}/g, message);

  // Replace {{businessContext}} placeholder
  prompt = prompt.replace(
    /{{businessContext}}/g,
    contextRules.businessContext || "general",
  );

  return prompt;
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
 * @returns {string} - The processed response
 */
const postProcessResponse = (response, contextRules) => {
  // Implement any post-processing logic here
  // For example, filtering out inappropriate content or formatting
  return response;
};

export default {
  processMessage,
};
