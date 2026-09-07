import { Badge } from "@/components/ui/badge";

/**
 * Marks a screen that the room built during the walkthrough. In the scaffold
 * repository the same component renders the placeholder card; here it renders
 * a small completed marker so the two repositories stay visually comparable.
 */
export function StepBadge({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-6">
      <Badge variant="success">DONE</Badge>{" "}
      <span className="text-xs font-bold tracking-widest text-muted-foreground">
        STEP {step} &middot; {title.toUpperCase()}
      </span>
    </div>
  );
}
