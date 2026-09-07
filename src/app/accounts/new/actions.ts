"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/types";
import type { NewAccountState } from "./new-account-state";

export async function createAccount(_previousState: NewAccountState, formData: FormData): Promise<NewAccountState> {
  const customerNik = String(formData.get("customerNik") ?? "");
  const customerName = String(formData.get("customerName") ?? "");
  let accountNumber: string;

  try {
    const account = await api.createAccount({ customerNik, customerName });
    accountNumber = account.accountNumber;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      return {
        formError: error.status === 409 ? error.message : undefined,
        fieldErrors: error.fieldErrors(),
      };
    }

    return {
      formError: "We could not open the account. Please try again.",
      fieldErrors: {},
    };
  }

  redirect(`/accounts/${accountNumber}`);
}
