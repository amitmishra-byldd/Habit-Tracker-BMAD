import { create } from "zustand";

export interface UIState {
  // State
  showRegisterModal: boolean;
  showLoginModal: boolean;
  showErrorToast: boolean;
  errorMessage: string;
  showSuccessToast: boolean;
  successMessage: string;

  // Actions
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  showError: (message: string) => void;
  hideError: () => void;
  showSuccess: (message: string) => void;
  hideSuccess: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  showRegisterModal: false,
  showLoginModal: false,
  showErrorToast: false,
  errorMessage: "",
  showSuccessToast: false,
  successMessage: "",

  // Actions
  openRegisterModal: () =>
    set({
      showRegisterModal: true,
    }),

  closeRegisterModal: () =>
    set({
      showRegisterModal: false,
    }),

  openLoginModal: () =>
    set({
      showLoginModal: true,
    }),

  closeLoginModal: () =>
    set({
      showLoginModal: false,
    }),

  showError: (message) =>
    set({
      showErrorToast: true,
      errorMessage: message,
    }),

  hideError: () =>
    set({
      showErrorToast: false,
      errorMessage: "",
    }),

  showSuccess: (message) =>
    set({
      showSuccessToast: true,
      successMessage: message,
    }),

  hideSuccess: () =>
    set({
      showSuccessToast: false,
      successMessage: "",
    }),
}));
