import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setAuthenticated: (authenticated) =>
    set({
      isAuthenticated: authenticated,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearError: () =>
    set({
      error: null,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      error: null,
    }),
}));
