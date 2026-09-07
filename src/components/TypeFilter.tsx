import Link from "next/link";

import { Button } from "@/components/ui/button";

const FILTERS = [
  { label: "All", value: "" },
  { label: "Deposits", value: "DEPOSIT" },
  { label: "Withdrawals", value: "WITHDRAWAL" },
];

export function TypeFilter({
  active,
  href,
}: {
  active: string;
  href: (type: string) => string;
}) {
  return (
    <nav aria-label="Filter by transaction type" className="flex gap-2 text-sm">
      {FILTERS.map((f) => {
        const on = active === f.value;
        return (
          <Button
            key={f.label}
            asChild
            size="sm"
            variant={on ? "default" : "outline"}
          >
            <Link href={href(f.value)} aria-current={on ? "page" : undefined}>
              {f.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
