import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegister } from "../hooks/useRegister";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch("password");
  const registerMutation = useRegister();
  const isLoading = useAuthStore((state) => state.isLoading);

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      useUIStore.getState().showError("Passwords do not match");
      return;
    }

    registerMutation.mutate({
      email: data.email,
      username: data.username,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Username Field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="johndoe"
          disabled={isLoading}
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 20,
              message: "Username must be at most 20 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_-]+$/,
              message:
                "Username can only contain letters, numbers, underscores, and hyphens",
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.username
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            validate: (value) => {
              if (!/[A-Z]/.test(value))
                return "Password must contain at least one uppercase letter";
              if (!/[a-z]/.test(value))
                return "Password must contain at least one lowercase letter";
              if (!/[0-9]/.test(value))
                return "Password must contain at least one number";
              if (!/[^a-zA-Z0-9]/.test(value))
                return "Password must contain at least one special character";
              return true;
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.password
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.confirmPassword
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || registerMutation.isPending}
        className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
          isLoading || registerMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {isLoading || registerMutation.isPending
          ? "Creating Account..."
          : "Create Account"}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </p>
    </form>
  );
}
