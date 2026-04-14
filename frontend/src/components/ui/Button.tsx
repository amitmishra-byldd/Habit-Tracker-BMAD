import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  loading?: boolean;
  children: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  className = "",
  children,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin mr-2 h-4 w-4 text-white"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
