import React from "react";

export type WelcomeCardProps = {
  username: string;
  email: string;
};

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  username,
  email,
}) => (
  <div className="bg-white rounded-lg shadow p-6 mb-4">
    <div className="text-lg font-semibold text-gray-800">
      Welcome, {username}
    </div>
    <div className="text-sm text-gray-600">{email}</div>
  </div>
);
