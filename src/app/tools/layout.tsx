import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToolsSidebar } from "@/components/tools/tools-sidebar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <ToolsSidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
