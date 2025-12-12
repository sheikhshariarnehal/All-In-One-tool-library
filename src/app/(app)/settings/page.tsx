import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - Tool Library",
  description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account and preferences.
      </p>
      {/* Settings form will be added here */}
    </div>
  );
}
