import { Skeleton as UiSkeleton } from "@/components/ui/skeleton";

/**
 * Re-exported under its original name so every existing `loading.tsx` keeps
 * importing from "@/components/Skeleton" unchanged. The shape it renders now
 * comes from components/ui/skeleton.tsx — one primitive, reused everywhere a
 * screen needs a "this is loading" placeholder.
 */
export function Skeleton({ className = "h-40" }: { className?: string }) {
  return <UiSkeleton className={className} />;
}
