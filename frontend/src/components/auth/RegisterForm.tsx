import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";

export type RegisterFormProps = {
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
  loading?: boolean;
  error?: string;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!username.trim() || !email.trim() || !password) return;
    onSubmit({ username: username.trim(), email: email.trim(), password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-white rounded-lg shadow p-8"
    >
      <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
        Register
      </h2>
      <FormField
        label="Username"
        htmlFor="register-username"
        error={touched && !username.trim() ? "Username is required" : undefined}
      >
        <Input
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />
      </FormField>
      <FormField
        label="Email"
        htmlFor="register-email"
        error={touched && !email.trim() ? "Email is required" : undefined}
      >
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormField>
      <FormField
        label="Password"
        htmlFor="register-password"
        error={touched && !password ? "Password is required" : undefined}
      >
        <Input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormField>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <Button type="submit" loading={loading} className="w-full mt-2">
        Register
      </Button>
      <div className="text-center mt-2">
        <a href="/login" className="text-blue-600 hover:underline text-sm">
          Already have an account? Login
        </a>
      </div>
    </form>
  );
};
