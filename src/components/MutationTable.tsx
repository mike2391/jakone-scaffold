import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAmount, formatDateTime } from "@/lib/format";
import type { Mutation, Page } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

export function MutationTable({ page, accountNumber, type = "" }: { page: Page<Mutation>; accountNumber: string; type?: string }) {
  if (page.content.length === 0) {
    return <EmptyState title="No transactions yet" hint="A deposit or withdrawal will appear here immediately." />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-0 odd:bg-transparent even:bg-transparent hover:bg-transparent">
            <TableHead>DATE</TableHead>
            <TableHead>TYPE</TableHead>
            <TableHead className="whitespace-nowrap">CHANNEL</TableHead>
            <TableHead className="text-right">AMOUNT</TableHead>
            <TableHead className="text-right">BALANCE</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {page.content.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{formatDateTime(m.createdAt)}</TableCell>
              <TableCell>
                <span className={m.transactionType === "DEPOSIT" ? "font-bold text-good" : "font-bold text-bad"}>{m.transactionType}</span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="outline">{m.channel}</Badge>
              </TableCell>
              <TableCell className="text-right font-bold">
                {m.transactionType === "DEPOSIT" ? "+" : "−"}
                {formatAmount(m.amount)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{formatAmount(m.resultingBalance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        page={page.page}
        totalPages={page.totalPages}
        href={(nextPage) => `/accounts/${accountNumber}?page=${nextPage}${type ? `&type=${type}` : ""}`}
      />
    </>
  );
}
