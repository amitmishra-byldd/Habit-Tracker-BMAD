import React from "react";

export type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "rounded",
}) => (
  <div
    className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
    style={{ width, height }}
    aria-busy="true"
    aria-label="Loading"
  />
);
