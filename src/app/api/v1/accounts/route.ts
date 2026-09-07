import { NextRequest, NextResponse } from "next/server";
import { fail } from "@/lib/http";
import { nextAccountNumber, store } from "@/lib/store";
import type { Account, FieldError } from "@/lib/types";

export const dynamic = "force-dynamic";

const PATH = "/api/v1/accounts";

/** GET /api/v1/accounts — not in the shared contract; convenience for the demo list. */
export async function GET() {
  return NextResponse.json(store().accounts);
}

/** POST /api/v1/accounts */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "MALFORMED_REQUEST", "The request body is not valid JSON.", PATH);
  }

  const { customerNik, customerName } = (body ?? {}) as Record<string, unknown>;
  const errors: FieldError[] = [];

  if (typeof customerNik !== "string" || customerNik.length === 0) {
    errors.push({
      field: "customerNik",
      code: "FIELD_REQUIRED",
      message: "customerNik is required.",
    });
  } else if (!/^\d{16}$/.test(customerNik)) {
    errors.push({
      field: "customerNik",
      code: "NIK_INVALID",
      message: "NIK must be exactly 16 digits.",
    });
  }

  if (typeof customerName !== "string" || customerName.trim().length < 3) {
    errors.push({
      field: "customerName",
      code: "NAME_TOO_SHORT",
      message: "Customer name must be at least 3 characters.",
    });
  }

  if (errors.length > 0) {
    return fail(422, "VALIDATION_FAILED", "The request could not be processed.", PATH, errors);
  }

  const s = store();
  if (s.accounts.some((a) => a.customerNik === customerNik)) {
    return fail(
      409,
      "NIK_ALREADY_REGISTERED",
      "An account already exists for this NIK.",
      PATH,
    );
  }

  const account: Account = {
    accountNumber: nextAccountNumber(),
    customerNik: customerNik as string,
    customerName: (customerName as string).trim(),
    balance: 0,
    currency: "IDR",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  };
  s.accounts.push(account);

  return NextResponse.json(account, {
    status: 201,
    headers: { Location: `${PATH}/${account.accountNumber}` },
  });
}
