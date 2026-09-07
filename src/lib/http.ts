/**
 * Helpers that make every mock route return the same error contract the
 * Day 3 API design agreed on.  The real backend must match this shape.
 */
import { NextResponse } from "next/server";
import type { ApiErrorBody, FieldError } from "./types";

export function fail(
  status: number,
  code: string,
  message: string,
  path: string,
  errors?: FieldError[],
) {
  const body: ApiErrorBody = {
    timestamp: new Date().toISOString(),
    path,
    code,
    message,
    ...(errors ? { errors } : {}),
  };
  return NextResponse.json(body, { status });
}

export function notFound(accountNumber: string, path: string) {
  return fail(
    404,
    "ACCOUNT_NOT_FOUND",
    `No account with number ${accountNumber}.`,
    path,
  );
}
