import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * The card that stands where a screen will be.
 *
 * The scaffold runs from the first minute, and every screen the room has not
 * built yet says so plainly, with its brief and its acceptance check attached.
 * Replacing one of these cards with working code is the unit of progress
 * through the day. It is also the first thing localhost:3000 renders, so it
 * is the room's first look at the shadcn primitives it will spend the day
 * building with.
 */
export function StepPlaceholder({
  step,
  title,
  brief,
  checks,
  file,
}: {
  step: number;
  title: string;
  brief: string;
  checks: string[];
  file: string;
}) {
  return (
    <Card className="border-2 border-dashed bg-panel shadow-none">
      <CardHeader>
        <Badge>STEP {step}</Badge>
        <CardTitle className="mt-2 text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-2xl text-muted-foreground">{brief}</p>

        <p className="mt-6 text-xs font-bold tracking-widest text-muted-foreground">
          YOU ARE EDITING
        </p>
        <p className="mt-1 font-mono text-sm">{file}</p>

        <p className="mt-6 text-xs font-bold tracking-widest text-muted-foreground">
          DONE WHEN
        </p>
        <ul className="mt-2 max-w-2xl space-y-1 text-sm text-muted-foreground">
          {checks.map((c) => (
            <li key={c} className="flex gap-2">
              <span aria-hidden className="text-primary">&#9633;</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted-foreground">
          The full brief is in <span className="font-mono">WALKTHROUGH.md</span>.
          Falling behind is recoverable: run{" "}
          <span className="font-mono">{`./catch-up.sh ${step}`}</span> and rejoin
          the room.
        </p>
        <Button asChild variant="link" className="mt-2 h-auto p-0">
          <Link href="/">Back to accounts</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
