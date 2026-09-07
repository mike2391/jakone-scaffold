"use client";

import { useActionState, useEffect, useState } from "react";
import { BalanceCard } from "@/components/BalanceCard";
import { MutationTable } from "@/components/MutationTable";
import { TypeFilter } from "@/components/TypeFilter";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBanner } from "@/components/ErrorBanner";
import type { Account, Mutation, Page } from "@/lib/types";
import type { TransactState } from "./transact-state";
import { initialTransactState } from "./transact-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Processing..." : "Submit transaction"}
    </Button>
  );
}

export function TransactForm({
  account,
  initialPage,
  type,
  action,
}: {
  account: Account;
  initialPage: Page<Mutation>;
  type: string;
  action: (previousState: TransactState, formData: FormData) => Promise<TransactState>;
}) {
  const [balance, setBalance] = useState(account.balance);
  const [mutations, setMutations] = useState(initialPage.content);

  useEffect(() => {
    setBalance(account.balance);
    setMutations(initialPage.content);
  }, [account.balance, initialPage.content, type]);

  const submitTransaction = async (previousState: TransactState, formData: FormData) => {
    const nextState = await action(previousState, formData);

    if (nextState.status === "success" && nextState.transaction) {
      setBalance(nextState.transaction.resultingBalance);

      if (!type || nextState.transaction.transactionType === type) {
        setMutations((current) => [nextState.transaction!, ...current.filter((mutation) => mutation.id !== nextState.transaction!.id)]);
      }
    }

    return nextState;
  };

  const [state, formAction] = useActionState(submitTransaction, initialTransactState);

  const displayedAccount = { ...account, balance };
  const displayedPage = { ...initialPage, content: mutations };

  return (
    <>
      <BalanceCard account={displayedAccount} />
      <section className="my-8 rounded-lg border border-rule bg-panel p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold">Make a transaction</h2>
          <p className="mt-1 text-sm text-muted">Deposit or withdraw funds from this account.</p>
        </div>

        <form action={formAction} className="grid gap-5 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="type">Transaction type</Label>
            <Select name="type" defaultValue="DEPOSIT">
              <SelectTrigger id="type" aria-invalid={Boolean(state.fieldErrors.type)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEPOSIT">Deposit</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
              </SelectContent>
            </Select>
            {state.fieldErrors.type ?
              <p className="text-sm text-bad">{state.fieldErrors.type}</p>
            : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (IDR)</Label>
            <Input id="amount" name="amount" type="number" min="1" step="1" placeholder="50000" aria-invalid={Boolean(state.fieldErrors.amount)} />
            {state.fieldErrors.amount ?
              <p className="text-sm text-bad">{state.fieldErrors.amount}</p>
            : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="channel">Channel</Label>
            <Select name="channel" defaultValue="CASH">
              <SelectTrigger id="channel" aria-invalid={Boolean(state.fieldErrors.channel)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
                <SelectItem value="QRIS">QRIS</SelectItem>
              </SelectContent>
            </Select>
            {state.fieldErrors.channel ?
              <p className="text-sm text-bad">{state.fieldErrors.channel}</p>
            : null}
          </div>

          <div className="flex flex-col gap-3 sm:col-span-3 sm:flex-row sm:items-center sm:justify-between">
            <div aria-live="polite">
              {state.message ?
                state.status === "error" ?
                  <ErrorBanner message={state.message} />
                : <p className="text-sm font-bold text-good">{state.message}</p>
              : null}
            </div>
            <SubmitButton />
          </div>
        </form>
      </section>
      <div className="my-6 flex items-center justify-between gap-4 font-semibold">
        <h1>Riwayat Transaksi</h1>
        <TypeFilter active={type} href={(nextType) => `/accounts/${account.accountNumber}${nextType ? `?type=${nextType}` : ""}`} />
      </div>
      <MutationTable page={displayedPage} accountNumber={account.accountNumber} type={type} />
    </>
  );
}
