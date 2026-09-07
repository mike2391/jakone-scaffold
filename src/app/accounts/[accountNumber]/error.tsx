"use client";

import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ErrorBanner";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-4">
      <ErrorBanner message="We could not load this account. The service may be unavailable." />
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
