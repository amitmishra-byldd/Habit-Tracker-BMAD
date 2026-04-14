import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">
          Login to continue building your coding habits
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
