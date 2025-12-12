import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites - Tool Library",
  description: "Your favorite tools for quick access.",
};

export default function FavoritesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Favorite Tools</h1>
      <p className="text-muted-foreground mb-8">
        Quick access to your most-used tools.
      </p>
      {/* Favorites grid will be added here */}
    </div>
  );
}
