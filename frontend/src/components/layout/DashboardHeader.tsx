import React from "react";

interface DashboardHeaderProps {
  username?: string;
  email?: string;
  onLogout?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  username,
  email,
  onLogout,
}) => (
  <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 mb-6 border-b border-gray-200">
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Habit Tracker</h1>
      {username && (
        <div className="text-sm text-gray-600 mt-1">
          Welcome, <span className="font-semibold">{username}</span>
          {email && <span className="ml-2 text-gray-400">({email})</span>}
        </div>
      )}
    </div>
    {onLogout && (
      <button
        onClick={onLogout}
        className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
      >
        Logout
      </button>
    )}
  </header>
);

export default DashboardHeader;
