import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History - Tool Library",
  description: "Your tool usage history and recent activities.",
};

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Usage History</h1>
      <p className="text-muted-foreground mb-8">
        Track your recent tool usage and activities.
      </p>
      {/* History list will be added here */}
    </div>
  );
}
