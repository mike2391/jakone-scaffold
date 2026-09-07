/**
 * The mock store.  In-memory only: no database, no ORM, no persistence.
 *
 * It exists so that the frontend can be built on Day 4 against exactly the
 * contract the backend will implement on Day 5.  Restarting the dev server
 * resets it to data/*.json, which is a feature during a workshop.
 */
import seedAccounts from "../../data/accounts.json";
import seedMutations from "../../data/mutations.json";
import type { Account, Mutation } from "./types";

interface Store {
  accounts: Account[];
  mutations: Mutation[];
  nextMutationId: number;
  nextAccountSeq: number;
  /** Idempotency-Key -> the response body that key already produced. */
  idempotency: Map<string, unknown>;
}

// Survive Next.js hot reload in development.
const globalStore = globalThis as unknown as { __jakone?: Store };

function create(): Store {
  const accounts = structuredClone(seedAccounts) as Account[];
  const mutations = structuredClone(seedMutations) as Mutation[];
  return {
    accounts,
    mutations,
    nextMutationId: Math.max(0, ...mutations.map((m) => m.id)) + 1,
    nextAccountSeq: 1029387,
    idempotency: new Map(),
  };
}

export function store(): Store {
  if (!globalStore.__jakone) globalStore.__jakone = create();
  return globalStore.__jakone;
}

export function nextAccountNumber(): string {
  const s = store();
  return `DKI-${s.nextAccountSeq++}`;
}

export function findAccount(accountNumber: string): Account | undefined {
  return store().accounts.find((a) => a.accountNumber === accountNumber);
}
