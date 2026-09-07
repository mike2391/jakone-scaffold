import { api } from "@/lib/api";
import Link from "next/link";

export default async function AccountsPage() {
  const accounts = await api.listAccounts();

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Link href="/accounts/create" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700">
          Create account
        </Link>
      </header>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Link key={account.accountNumber} href={`/accounts/${account.accountNumber}`} className="rounded-lg border p-4 transition hover:bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{account.customerName}</h2>
                <p className="text-gray-600">{account.accountNumber}</p>
              </div>
              <p className="text-xl font-bold whitespace-nowrap">Rp {account.balance.toLocaleString("id-ID")}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
