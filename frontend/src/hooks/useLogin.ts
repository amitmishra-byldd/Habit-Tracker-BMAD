import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { loginUser, LoginRequest } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { useQueryClient } from "@tanstack/react-query";
import { useHabitStore } from "../store/habitStore";

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const showError = useUIStore((state) => state.showError);
  const showSuccess = useUIStore((state) => state.showSuccess);
  const queryClient = useQueryClient();
  const clearHabits = useHabitStore((s) => s.setSelectedHabit);

  return useMutation({
    mutationFn: (data: LoginRequest) => loginUser(data),
    onMutate: () => {
      useAuthStore.setState({ isLoading: true, error: null });
      queryClient.clear();
      clearHabits(null);
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.message); // Store JWT for fallback
        showSuccess(data.message || "Login successful!");

        // Redirect to originally requested page or dashboard
        setTimeout(() => {
          const redirectPath =
            sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        }, 1000);
      } else {
        showError(data.message || "Login failed");
      }
      useAuthStore.setState({ isLoading: false });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      showError(message);
      useAuthStore.setState({ isLoading: false, error: message });
    },
  });
}
