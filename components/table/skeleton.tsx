import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Skeleton className="h-7 w-64 rounded-lg" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-9 w-80 rounded-lg" />
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
    </div>
  );
}
