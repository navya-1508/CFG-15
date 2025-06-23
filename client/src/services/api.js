import axios from "axios";

const API_URL = "/api";

// Configure axios defaults
axios.defaults.withCredentials = true; // Enable cookies

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists in localStorage
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

// Handle response errors (like 401 unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If 401 error and not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Redirect to login page if unauthorized
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};

// User services
export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch profile" };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/user/updateprofile", profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update profile" };
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get("/user/dashboard");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch dashboard" };
    }
  },

  requestPromotion: async (reason) => {
    try {
      const response = await api.post("/user/request-saathi-promotion", {
        reason,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to submit promotion request",
        }
      );
    }
  },
};

// Admin services
export const adminService = {
  getPromotionRequests: async () => {
    try {
      const response = await api.get("/user/promotion-requests");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch promotion requests",
        }
      );
    }
  },

  processPromotionRequest: async (userId, approved, feedback) => {
    try {
      const response = await api.post("/user/process-promotion", {
        userId,
        approved,
        feedback,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to process promotion request",
        }
      );
    }
  },
};

// Course services
export const courseService = {
  getCourses: async () => {
    try {
      const response = await api.get("/courses");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch courses" };
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch course details" }
      );
    }
  },
};

export default api;
