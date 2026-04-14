import React from "react";
import { Container } from "../layout/Container";
import { DashboardHeader } from "../layout/DashboardHeader";
import { WelcomeCard } from "./WelcomeCard";
import { HabitList } from "../habits/HabitList";
import { AddHabitModal } from "../habits/AddHabitModal";

// Dummy props for illustration; replace with real data/integration
export type DashboardPageProps = {
  username: string;
  email: string;
  habits: any[];
  loading?: boolean;
  error?: string;
  onLogout: () => void;
  // ...handlers for habits
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  username,
  email,
  habits,
  loading,
  error,
  onLogout,
}) => {
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <Container>
      <DashboardHeader username={username} email={email} onLogout={onLogout} />
      <WelcomeCard username={username} email={email} />
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setAddOpen(true)}
        >
          + Add Habit
        </button>
      </div>
      <HabitList habits={habits} loading={loading} error={error} />
      <AddHabitModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={() => {}}
      />
    </Container>
  );
};
