import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { Account } from "@/lib/types";

export function BalanceCard({ account }: { account: Account }) {
  return (
    <Card className="border-0 bg-navy text-white">
      <CardContent className="p-8">
        <p className="text-xs font-bold tracking-widest text-sky">AVAILABLE BALANCE</p>
        <p className="mt-3 text-4xl font-bold">{formatIDR(account.balance)}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-white/60">Account number</dt>
            <dd className="font-bold">{account.accountNumber}</dd>
          </div>
          <div>
            <dt className="text-white/60">Holder</dt>
            <dd className="font-bold">{account.customerName}</dd>
          </div>
          <div>
            <dt className="text-white/60">Opened</dt>
            <dd className="font-bold">{formatDateTime(account.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
