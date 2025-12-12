"use client";

import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getToolWithComponent } from "@/lib/tools/registry";

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

export function ToolWrapperClient({ slug }: ToolWrapperClientProps) {
  const tool = getToolWithComponent(slug);

  if (!tool) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Tool not found</p>
        </CardContent>
      </Card>
    );
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
