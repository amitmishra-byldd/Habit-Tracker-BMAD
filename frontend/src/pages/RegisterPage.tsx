import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const successMessage = useUIStore((state) => state.successMessage);
  const showSuccessToast = useUIStore((state) => state.showSuccessToast);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        useUIStore.getState().hideSuccess();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // Navigate to dashboard after successful registration
  useEffect(() => {
    if (successMessage === "Registration successful!" && isAuthenticated) {
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    }
  }, [successMessage, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Join Habit Tracker
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Start building consistent coding habits today
        </p>

        <RegisterForm />

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}
