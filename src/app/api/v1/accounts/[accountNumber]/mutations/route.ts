import { NextRequest, NextResponse } from "next/server";
import { fail, notFound } from "@/lib/http";
import { findAccount, store } from "@/lib/store";
import type { Mutation, Page } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_SIZE = 100;

/** GET /api/v1/accounts/{accountNumber}/mutations?page=&size=&type= */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> },
) {
  const { accountNumber } = await params;
  const path = `/api/v1/accounts/${accountNumber}/mutations`;

  if (!findAccount(accountNumber)) return notFound(accountNumber, path);

  const sp = request.nextUrl.searchParams;
  const page = Number(sp.get("page") ?? 0);
  const size = Number(sp.get("size") ?? 20);
  const type = sp.get("type");

  if (!Number.isInteger(page) || page < 0) {
    return fail(422, "INVALID_PAGE", "page must be a non-negative integer.", path);
  }
  if (!Number.isInteger(size) || size < 1 || size > MAX_SIZE) {
    return fail(422, "INVALID_SIZE", `size must be between 1 and ${MAX_SIZE}.`, path);
  }
  if (type && type !== "DEPOSIT" && type !== "WITHDRAWAL") {
    return fail(422, "UNKNOWN_TYPE", "type must be DEPOSIT or WITHDRAWAL.", path);
  }

  const all = store()
    .mutations.filter((m) => m.accountNumber === accountNumber)
    .filter((m) => (type ? m.transactionType === type : true))
    // Newest first — stated in the contract, not left to the ORM.
    .sort(
      (a, b) =>
        Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id - a.id,
    );

  const body: Page<Mutation> = {
    content: all.slice(page * size, page * size + size),
    page,
    size,
    totalElements: all.length,
    totalPages: Math.max(1, Math.ceil(all.length / size)),
  };
  return NextResponse.json(body);
}
