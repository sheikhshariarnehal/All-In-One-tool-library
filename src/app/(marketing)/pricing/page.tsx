import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Tool Library",
  description: "Choose the perfect plan for your needs. Free, Pro, and Enterprise plans available.",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">
        Simple, Transparent Pricing
      </h1>
      <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
        Choose the plan that fits your needs. Upgrade or downgrade at any time.
      </p>
      {/* Pricing cards will be added here */}
    </div>
  );
}
