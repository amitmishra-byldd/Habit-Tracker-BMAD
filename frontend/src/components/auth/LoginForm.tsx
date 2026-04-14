import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";

export type LoginFormProps = {
  onSubmit: (data: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email.trim() || !password) return;
    onSubmit({ email: email.trim(), password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-white rounded-lg shadow p-8"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
        Login
      </h2>
      <FormField
        label="Email"
        htmlFor="login-email"
        error={touched && !email.trim() ? "Email is required" : undefined}
      >
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="login-password"
        error={touched && !password ? "Password is required" : undefined}
      >
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormField>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <Button type="submit" loading={loading} className="w-full mt-2">
        Login
      </Button>
      <div className="text-center mt-2">
        <a href="/register" className="text-blue-600 hover:underline text-sm">
          Don't have an account? Register
        </a>
      </div>
    </form>
  );
};
