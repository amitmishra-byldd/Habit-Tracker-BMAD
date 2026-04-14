import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

// Use relative paths so vite proxy handles the routing
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Create axios instance with credentials
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token from localStorage (fallback)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on 401
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        // Clear Zustand state
        import("../store/authStore").then((mod) => {
          mod.useAuthStore.getState().logout();
        });
        import("../store/uiStore").then((mod) => {
          mod.useUIStore
            .getState()
            .showError("Session expired. Please log in again.");
        });
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
  };
  message: string;
}

/**
 * Register a new user
 */
export async function registerUser(
  data: RegisterRequest,
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/register",
      data,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
    throw error;
  }
}

/**
 * Login user
 */
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/api/auth/login",
      data,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
    throw error;
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/api/auth/logout");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const response = await apiClient.get<AuthResponse>("/api/auth/me");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: error.message,
        }
      );
    }
    throw error;
  }
}
