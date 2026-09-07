import { NextRequest, NextResponse } from "next/server";
import { fail, notFound } from "@/lib/http";
import { findAccount, store } from "@/lib/store";
import type { Channel, FieldError, Mutation, TransactionType } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPES: TransactionType[] = ["DEPOSIT", "WITHDRAWAL"];
const CHANNELS: Channel[] = ["CASH", "TRANSFER", "QRIS"];

/** POST /api/v1/accounts/{accountNumber}/transact */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> },
) {
  const { accountNumber } = await params;
  const path = `/api/v1/accounts/${accountNumber}/transact`;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "MALFORMED_REQUEST", "The request body is not valid JSON.", path);
  }

  const { type, amount, channel } = (body ?? {}) as Record<string, unknown>;
  const errors: FieldError[] = [];

  if (!TYPES.includes(type as TransactionType)) {
    errors.push({
      field: "type",
      code: "UNKNOWN_TYPE",
      message: "Type must be DEPOSIT or WITHDRAWAL.",
    });
  }
  if (!CHANNELS.includes(channel as Channel)) {
    errors.push({
      field: "channel",
      code: "UNKNOWN_CHANNEL",
      message: "Channel must be CASH, TRANSFER or QRIS.",
    });
  }
  if (typeof amount !== "number" || !Number.isInteger(amount)) {
    errors.push({
      field: "amount",
      code: "FIELD_REQUIRED",
      message: "Amount must be a whole number of rupiah.",
    });
  } else if (amount <= 0) {
    errors.push({
      field: "amount",
      code: "AMOUNT_NOT_POSITIVE",
      message: "Amount must be greater than zero.",
    });
  }

  if (errors.length > 0) {
    return fail(422, "VALIDATION_FAILED", "The request could not be processed.", path, errors);
  }

  const account = findAccount(accountNumber);
  if (!account) return notFound(accountNumber, path);

  // Idempotency: the same key never moves money twice.
  const key = request.headers.get("Idempotency-Key");
  const s = store();
  if (key && s.idempotency.has(key)) {
    return NextResponse.json(s.idempotency.get(key), { status: 200 });
  }

  const value = amount as number;
  const signed = type === "DEPOSIT" ? value : -value;

  if (account.balance + signed < 0) {
    return fail(
      409,
      "INSUFFICIENT_FUNDS",
      `Balance ${account.balance} is less than the requested ${value}.`,
      path,
    );
  }

  account.balance += signed;

  const mutation: Mutation = {
    id: s.nextMutationId++,
    accountNumber,
    transactionType: type as TransactionType,
    channel: channel as Channel,
    amount: value,
    resultingBalance: account.balance,
    createdAt: new Date().toISOString(),
  };
  s.mutations.push(mutation);

  const response = {
    mutationId: mutation.id,
    accountNumber,
    resultingBalance: account.balance,
    createdAt: mutation.createdAt,
  };
  if (key) s.idempotency.set(key, response);

  return NextResponse.json(response, { status: 201 });
}
