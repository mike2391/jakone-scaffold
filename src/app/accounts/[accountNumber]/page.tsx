import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { TransactForm } from "./TransactForm";
import { transact } from "./actions";

/**
 * STEPS 3, 4, 5 and 9 — the account screen, built in four passes.
 *
 *   3  read the account, render BalanceCard, translate a 404 into notFound()
 *   4  add the mutations table, the empty state and loading.tsx
 *   5  move the page number and the type filter into the URL
 *   9  stream the history behind Suspense so the balance is not held hostage
 *
 * Each pass replaces this file. The brief for each is in WALKTHROUGH.md.
 */
export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountNumber: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const { accountNumber } = await params;
  const { page: pageParam, type = "" } = await searchParams;
  const page = Number(pageParam ?? 0);

  try {
    const account = await api.getAccount(accountNumber);
    const initialPage = await api.listMutations(accountNumber, { page, size: 5, type });

    if (!account) {
      notFound();
    }

    const transactForAccount = transact.bind(null, accountNumber);

    return (
      <>
        <TransactForm account={account} initialPage={initialPage} type={type} action={transactForAccount} />
      </>
    );
  } catch (error: unknown) {
    // If API returns 404, show not-found page
    if (error instanceof Response && error.status === 404) {
      notFound();
    }
    // Re-throw other errors to be handled by error boundary
    throw error;
  }
}
