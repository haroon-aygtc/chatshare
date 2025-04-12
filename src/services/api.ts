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
};

export default api;
