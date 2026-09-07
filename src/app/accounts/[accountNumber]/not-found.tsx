import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <EmptyState
        title="No such account"
        hint="The API answered 404 ACCOUNT_NOT_FOUND for this account number."
      />
      <Button asChild variant="link" className="h-auto p-0">
        <Link href="/">Back to accounts</Link>
      </Button>
    </div>
  );
}
