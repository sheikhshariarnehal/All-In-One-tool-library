import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Tool Library",
  description: "Your personal dashboard with recent tools, favorites, and usage statistics.",
};

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard stats and widgets will be added here */}
      </div>
    </div>
  );
}
