import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/auth
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if needed
      localStorage.removeItem("token");
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// API service for context rules
export const contextRulesApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/contexts?page=${page}&limit=${limit}`);
    return response.data;
  },

  getByBusiness: async (businessContext: string) => {
    const response = await api.get(`/contexts/business/${businessContext}`);
    return response.data;
  },

  create: async (contextRule: any) => {
    const response = await api.post("/contexts", contextRule);
    return response.data;
  },

  update: async (id: string, contextRule: any) => {
    const response = await api.put(`/contexts/${id}`, contextRule);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/contexts/${id}`);
    return response.data;
  },
};

// API service for chat sessions
export const chatApi = {
  createSession: async (userId = "anonymous", businessContext = "general") => {
    const response = await api.post("/chat/session", {
      user_id: userId,
      business_context: businessContext,
    });
    return response.data;
  },

  getSession: async (roomId: string) => {
    const response = await api.get(`/chat/session/${roomId}`);
    return response.data;
  },

  getMessages: async (roomId: string, page = 1, limit = 50) => {
    const response = await api.get(
      `/chat/messages/${roomId}?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  sendMessage: async (
    roomId: string,
    content: string,
    userId = "anonymous",
    businessContext = "general",
  ) => {
    const response = await api.post("/chat/message", {
      room_id: roomId,
      content,
      user_id: userId,
      business_context: businessContext,
    });
    return response.data;
  },

  deleteSession: async (roomId: string) => {
    const response = await api.delete(`/chat/session/${roomId}`);
    return response.data;
  },
};

// API service for authentication
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

// API service for widget configuration
export const widgetConfigApi = {
  getWidgetConfig: async (businessContext = "general") => {
    const response = await api.get(
      `/admin/widget-config?businessContext=${businessContext}`,
    );
    return response.data;
  },

  saveWidgetConfig: async (config: any) => {
    const response = await api.post("/admin/widget-config", config);
    return response.data;
  },
};

// API service for AI configuration
export const aiConfigApi = {
  getAIConfiguration: async () => {
    const response = await api.get("/admin/ai-configuration");
    return response.data;
  },

  saveAIConfiguration: async (config: any) => {
    const response = await api.post("/admin/ai-configuration", config);
    return response.data;
  },
};

// API service for AI logs
export const aiLogsApi = {
  getAILogs: async (
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    model = "all",
    businessContext = "all",
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search) params.append("search", search);
    if (status !== "all") params.append("status", status);
    if (model !== "all") params.append("model", model);
    if (businessContext !== "all")
      params.append("businessContext", businessContext);

    const response = await api.get(`/admin/ai-logs?${params.toString()}`);
    return response.data;
  },

  getAILogById: async (id: string) => {
    const response = await api.get(`/admin/ai-logs/${id}`);
    return response.data;
  },

  exportAILogs: async (format = "json", filters = {}) => {
    const params = new URLSearchParams({ format });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const response = await api.get(
      `/admin/ai-logs/export?${params.toString()}`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },
};

// API service for embed code
export const embedCodeApi = {
  getEmbedSettings: async (businessContext = "general") => {
    const response = await api.get(
      `/admin/embed-settings?businessContext=${businessContext}`,
    );
    return response.data;
  },

  saveEmbedSettings: async (settings: any) => {
    const response = await api.post("/admin/embed-settings", settings);
    return response.data;
  },
};

// API service for admin operations
export const adminApi = {
  getUsers: async (page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.append("search", search);

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getSessions: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/admin/sessions?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },

  // Prompt Templates API
  getPromptTemplates: async (page = 1, limit = 10, businessContext = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (businessContext) params.append("businessContext", businessContext);

    const response = await api.get(`/templates?${params.toString()}`);
    return response.data;
  },

  getTemplateById: async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  getDefaultTemplate: async (businessContext: string) => {
    const response = await api.get(`/templates/default/${businessContext}`);
    return response.data;
  },

  createPromptTemplate: async (template: any) => {
    const response = await api.post("/templates", template);
    return response.data;
  },

  updatePromptTemplate: async (id: string, template: any) => {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
  },

  deletePromptTemplate: async (id: string) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },

  // Response Formats API
  getResponseFormats: async (page = 1, limit = 10, businessContext = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (businessContext) params.append("businessContext", businessContext);

    const response = await api.get(`/formats?${params.toString()}`);
    return response.data;
  },

  getFormatById: async (id: string) => {
    const response = await api.get(`/formats/${id}`);
    return response.data;
  },

  getDefaultFormat: async (businessContext: string) => {
    const response = await api.get(`/formats/default/${businessContext}`);
    return response.data;
  },

  createResponseFormat: async (format: any) => {
    const response = await api.post("/formats", format);
    return response.data;
  },

  updateResponseFormat: async (id: string, format: any) => {
    const response = await api.put(`/formats/${id}`, format);
    return response.data;
  },

  deleteResponseFormat: async (id: string) => {
    const response = await api.delete(`/formats/${id}`);
    return response.data;
  },

  formatResponse: async (
    formatId: string,
    response: string,
    knowledgeSources: any[] = [],
    followUpQuestions: any[] = [],
  ) => {
    const data = {
      formatId,
      response,
      knowledgeSources,
      followUpQuestions,
    };
    const apiResponse = await api.post("/formats/format-response", data);
    return apiResponse.data;
  },

  // Knowledge Base API
  getKnowledgeEntries: async (page = 1, limit = 10, businessContext = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (businessContext) params.append("businessContext", businessContext);

    const response = await api.get(`/knowledge?${params.toString()}`);
    return response.data;
  },

  searchKnowledgeBase: async (query: string, businessContext = "general") => {
    const params = new URLSearchParams({
      query,
      businessContext,
    });

    const response = await api.get(`/knowledge/search?${params.toString()}`);
    return response.data;
  },

  // Follow-up Questions API
  getFollowUpQuestions: async (page = 1, limit = 10, businessContext = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (businessContext) params.append("businessContext", businessContext);

    const response = await api.get(`/followups?${params.toString()}`);
    return response.data;
  },

  getFollowUpsByBusinessContext: async (businessContext: string) => {
    const response = await api.get(`/followups/business/${businessContext}`);
    return response.data;
  },
};

export default api;
