import { NextResponse } from "next/server";
import { notFound } from "@/lib/http";
import { findAccount } from "@/lib/store";

export const dynamic = "force-dynamic";

/** GET /api/v1/accounts/{accountNumber} */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ accountNumber: string }> },
) {
  const { accountNumber } = await params;
  const account = findAccount(accountNumber);
  if (!account) {
    return notFound(accountNumber, `/api/v1/accounts/${accountNumber}`);
  }
  return NextResponse.json(account);
}
