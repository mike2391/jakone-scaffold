import type { Mutation } from "@/lib/types";

export type TransactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors: Record<string, string>;
  transaction?: Mutation;
};

export const initialTransactState: TransactState = {
  status: "idle",
  fieldErrors: {},
};
