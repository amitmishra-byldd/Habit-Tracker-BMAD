import { useMutation } from "@tanstack/react-query";
import { registerUser, RegisterRequest } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);
  const showError = useUIStore((state) => state.showError);
  const showSuccess = useUIStore((state) => state.showSuccess);

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerUser(data),
    onMutate: () => {
      // Set loading state
      useAuthStore.setState({ isLoading: true, error: null });
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        // Set user in store
        setUser(data.user);

        // Store token in localStorage (httpOnly cookie from server is automatic)
        localStorage.setItem("isAuthenticated", "true");

        // Show success message
        showSuccess(data.message || "Registration successful!");

        // Redirect will be handled by component
      } else {
        showError(data.message || "Registration failed");
      }
      useAuthStore.setState({ isLoading: false });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      showError(message);
      useAuthStore.setState({ isLoading: false, error: message });
    },
  });
}
