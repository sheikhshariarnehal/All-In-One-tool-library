"use client";

import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getToolWithComponent } from "@/lib/tools/registry";
import { AlertCircle, Construction, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ToolWrapperClientProps {
  slug: string;
}

function ToolSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

function ToolNotImplemented({ slug }: { slug: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          This tool is currently under development. We&apos;re working hard to bring you a great experience. 
          Check back soon!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/tools">
            <Button variant="outline">
              Browse Other Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ToolWrapperClient({ slug }: ToolWrapperClientProps) {
  const tool = getToolWithComponent(slug);

  if (!tool) {
    return <ToolNotImplemented slug={slug} />;
  }

  const ToolComponent = tool.component;

  return (
    <Suspense fallback={<ToolSkeleton />}>
      <Card>
        <CardContent className="p-6">
          <ToolComponent />
        </CardContent>
      </Card>
    </Suspense>
  );
}
