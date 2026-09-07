/**
 * The JakOne API contract, expressed as TypeScript types.
 *
 * These types are written from the Day 3 API contract, not from the mock.
 * When Day 7 swaps the mock for the real Spring Boot backend, nothing in this
 * file should have to change. If it does, the contract was not agreed.
 */

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";
export type Channel = "CASH" | "TRANSFER" | "QRIS";
export type AccountStatus = "ACTIVE" | "BLOCKED" | "CLOSED";

export interface Account {
  accountNumber: string;
  customerNik: string;
  customerName: string;
  /** Integer rupiah. Never a float — see Day 3, Section 2. */
  balance: number;
  currency: "IDR";
  status: AccountStatus;
  createdAt: string;
}

export interface Mutation {
  id: number;
  accountNumber: string;
  transactionType: TransactionType;
  channel: Channel;
  amount: number;
  resultingBalance: number;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateAccountRequest {
  customerNik: string;
  customerName: string;
}

export interface TransactRequest {
  type: TransactionType;
  amount: number;
  channel: Channel;
}

export interface TransactResponse {
  mutationId: number;
  accountNumber: string;
  resultingBalance: number;
  createdAt: string;
}

/** One field-level problem, as returned by the API. */
export interface FieldError {
  field: string;
  code: string;
  message: string;
}

/** The error body every non-2xx response carries. */
export interface ApiErrorBody {
  timestamp: string;
  path: string;
  code: string;
  message: string;
  errors?: FieldError[];
}

/** Thrown by the API client. Carries the status and the parsed body. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message);
    this.name = "ApiError";
  }

  /** Field name -> message, ready to attach to form inputs. */
  fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const e of this.body.errors ?? []) out[e.field] = e.message;
    return out;
  }
}
