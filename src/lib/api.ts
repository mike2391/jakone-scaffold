/**
 * The only module in the application that knows the API's base URL.
 *
 * Day 4  : API_BASE_URL is unset, so this points at the Next.js route handlers
 *          in src/app/api/v1 — the mock that serves the agreed contract.
 * Day 7  : set API_BASE_URL=http://localhost:8080 in .env.local and the same
 *          code talks to the real Spring Boot service. No component changes.
 */
import {
  ApiError,
  type Account,
  type ApiErrorBody,
  type CreateAccountRequest,
  type Mutation,
  type Page,
  type TransactRequest,
  type TransactResponse,
} from "./types";

const BASE = process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    // A balance must never be served from a cache.
    cache: "no-store",
  });

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network latency

  if (!res.ok) {
    const body = (await res.json().catch(() => ({
      timestamp: new Date().toISOString(),
      path,
      code: "UNREADABLE_ERROR",
      message: `The server returned ${res.status}.`,
    }))) as ApiErrorBody;
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  listAccounts: () => request<Account[]>("/accounts"),

  getAccount: (accountNumber: string) => request<Account>(`/accounts/${encodeURIComponent(accountNumber)}`),

  createAccount: (body: CreateAccountRequest) =>
    request<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  transact: (accountNumber: string, body: TransactRequest, idempotencyKey?: string) =>
    request<TransactResponse>(`/accounts/${encodeURIComponent(accountNumber)}/transact`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {},
    }),

  listMutations: (accountNumber: string, params: { page?: number; size?: number; type?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.page !== undefined) q.set("page", String(params.page));
    if (params.size !== undefined) q.set("size", String(params.size));
    if (params.type) q.set("type", params.type);
    const qs = q.toString();
    return request<Page<Mutation>>(`/accounts/${encodeURIComponent(accountNumber)}/mutations${qs ? `?${qs}` : ""}`);
  },
};
