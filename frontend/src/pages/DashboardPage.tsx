import React, { useState } from "react";
import HabitList from "../components/HabitList";
import AddHabitModal from "../components/AddHabitModal";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useUIStore } from "../store/uiStore";
import { useQueryClient } from "@tanstack/react-query";
import { useHabitStore } from "../store/habitStore";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const showSuccess = useUIStore((state) => state.showSuccess);
  const queryClient = useQueryClient();
  const clearHabits = useHabitStore((s) => s.setSelectedHabit);

  const handleLogout = async () => {
    try {
      await logoutUser();
      useAuthStore.getState().logout();
      localStorage.removeItem("isAuthenticated");
      queryClient.clear();
      clearHabits(null);
      showSuccess("Logged out successfully");
      navigate("/register", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600">
            Hello, <strong>{user?.username}</strong> ({user?.email})
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Habits</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Habit
            </button>
          </div>
          <HabitList />
        </div>
      </div>
      {showAdd && <AddHabitModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
