import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Pagination rendered as links, so the position lives in the URL rather than in
 * client state. That makes a page shareable, bookmarkable and correct under the
 * browser back button, none of which is true of a useState page counter.
 *
 * At either end the control is a disabled Button rather than a disabled link,
 * so a keyboard user is never offered a destination that does not exist.
 */
export function Pagination({
  page,
  totalPages,
  href,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
}) {
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <nav
      aria-label="Transaction history pages"
      className="mt-4 flex items-center justify-between text-sm"
    >
      {isFirst ? (
        <Button variant="ghost" size="sm" disabled>
          &larr; Previous
        </Button>
      ) : (
        <Button asChild variant="ghost" size="sm">
          <Link href={href(page - 1)} rel="prev">&larr; Previous</Link>
        </Button>
      )}
      <span className="text-muted-foreground">
        Page {page + 1} of {totalPages}
      </span>
      {isLast ? (
        <Button variant="ghost" size="sm" disabled>
          Next &rarr;
        </Button>
      ) : (
        <Button asChild variant="ghost" size="sm">
          <Link href={href(page + 1)} rel="next">Next &rarr;</Link>
        </Button>
      )}
    </nav>
  );
}
