import { ToolMetadata } from "@/lib/tools/metadata";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ToolWrapperProps {
  tool: ToolMetadata;
}

export function ToolSkeleton() {
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

// Server component wrapper - just renders the skeleton
// The actual tool is loaded client-side
export function ToolWrapper({ tool }: ToolWrapperProps) {
  return <ToolSkeleton />;
}
