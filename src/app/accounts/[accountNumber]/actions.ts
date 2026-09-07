"use server";

import { api } from "@/lib/api";
import { ApiError, type Channel, type TransactionType } from "@/lib/types";
import type { TransactState } from "./transact-state";

export async function transact(accountNumber: string, _previousState: TransactState, formData: FormData): Promise<TransactState> {
  const type = String(formData.get("type") ?? "");
  const channel = String(formData.get("channel") ?? "");
  const amount = Number(formData.get("amount"));

  try {
    const response = await api.transact(accountNumber, {
      type: type as TransactionType,
      amount,
      channel: channel as Channel,
    });

    return {
      status: "success",
      message: "Transaction completed successfully.",
      fieldErrors: {},
      transaction: {
        id: response.mutationId,
        accountNumber,
        transactionType: type as TransactionType,
        channel: channel as Channel,
        amount,
        resultingBalance: response.resultingBalance,
        createdAt: response.createdAt,
      },
    };
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        status: "error",
        message:
          error.status === 409 ? "Withdrawal amount cannot be greater than the available balance."
          : error.body.errors?.length ? undefined
          : error.message,
        fieldErrors: error.fieldErrors(),
      };
    }

    return {
      status: "error",
      message: "We could not complete the transaction. Please try again.",
      fieldErrors: {},
    };
  }
}
