import React from "react";

export type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
}) => (
  <div
    className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white flex items-center gap-2 transition-all
      ${type === "success" ? "bg-blue-600" : "bg-red-600"}`}
    role="alert"
    aria-live="assertive"
  >
    <span>{message}</span>
    {onClose && (
      <button
        className="ml-2 text-white/80 hover:text-white text-lg font-bold"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    )}
  </div>
);
