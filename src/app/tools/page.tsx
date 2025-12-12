import { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/tools/categories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "All Tools - Tool Library",
  description: "Browse our complete collection of free online tools for students, teachers, and professionals.",
  openGraph: {
    title: "All Tools - Tool Library",
    description: "Browse our complete collection of free online tools for students, teachers, and professionals.",
  },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Tools</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Explore our comprehensive collection of tools organized by category. 
          From document editing to AI-powered generators, find the perfect tool for your needs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.slug} href={`/tools/${category.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  {category.toolCount} tools
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
