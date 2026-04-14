import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </div>
  ),
);
Input.displayName = "Input";

export default Input;
