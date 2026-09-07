import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-36 w-full" />
    </div>
  );
}
