import React from "react";

export const Container: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => (
  <div className={`max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
