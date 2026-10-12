import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT access token to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for centralized error handling and 401 token invalidation
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid/expired session data safely
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    }
    return Promise.reject(error);
  }
);

// Helper to extract clean error message from API response
export const getErrorMessage = (error, fallback = "An unexpected error occurred.") => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return fallback;
};

// Authentication Endpoints
export const authAPI = {
  register: async (userData) => {
    // userData: { name, email, password }
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    // credentials: { email, password }
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

// Resume CRUD Endpoints
export const resumeAPI = {
  getAll: async () => {
    const response = await api.get("/resumes");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  create: async (resumeData) => {
    const response = await api.post("/resumes", resumeData);
    return response.data;
  },

  update: async (id, resumeData) => {
    const response = await api.put(`/resumes/${id}`, resumeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },
};

// AI Enhancement Endpoints
export const aiAPI = {
  getStatus: async () => {
    const response = await api.get("/ai/status");
    return response.data;
  },

  enhance: async ({ field, content, targetRole, technologies }) => {
    const response = await api.post("/ai/enhance", {
      field,
      content,
      targetRole,
      technologies,
    });
    return response.data;
  },
};

export default api;
