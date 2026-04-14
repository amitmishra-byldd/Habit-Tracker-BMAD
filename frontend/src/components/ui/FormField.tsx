import React from "react";

export type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  children,
}) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    {children}
    {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
  </div>
);
