# Day 4 walkthrough

Nine screens, built in this repository, `jakone-frontend-scaffold`, across
four sessions. It boots on the first minute and is missing nine screens; each
one renders a dashed placeholder card with its own brief and its own
acceptance checks until it is built.

**shadcn/ui is already installed.** `components.json`, `src/lib/utils.ts` and
every primitive under `src/components/ui/` are given, not something you set
up today.

## Schedule

| Time | Session | Steps |
|---|---|---|
| 08:00 – 08:15 | Opening — the pre-test | |
| 08:15 – 10:00 | **Session 1** — Rendering models and the App Router | 1, 2 |
| 10:00 – 10:15 | Break | |
| 10:15 – 12:00 | **Session 2** — Component architecture and the typed contract | 3, 4, 5 |
| 12:00 – 13:00 | Lunch | |
| 13:00 – 14:30 | **Session 3** — API integration and writing data | 6, 7 |
| 14:30 – 16:30 | **Session 4** — Creating a resource, streaming, and measuring | 8, 9 |
| 16:30 – 17:00 | Close — demonstrations, the post-test | |

Each step below carries a suggested time budget. They are lab minutes, on top
of the short piece of lecture that opens each session — the day is spent
mostly in the editor and the browser, not looking at slides.

## What is already written, and why

| File | What it is | Why it is given |
|---|---|---|
| `src/lib/types.ts` | The API contract, as TypeScript types | It comes from the contract, not from the mock. Retyping it teaches nothing about rendering. |
| `src/lib/api.ts` | The one module that knows the base URL | Every step reads through it. Writing it nine times would teach the same lesson nine times. |
| `src/lib/format.ts` | `formatIDR`, and Jakarta-timezone dates | A formatting bug is not the lesson of any step; get it right once. |
| `src/lib/utils.ts` | `cn()` — merges Tailwind classes safely | shadcn's own primitives depend on it. |
| `src/lib/http.ts`, `src/lib/store.ts` | The mock's internals — the error contract and the in-memory store | The mock is infrastructure. The room builds screens against it, not the mock itself. |
| `data/*.json` | Seed accounts and mutations | Fixed data means a fixed, repeatable demonstration. `DKI-1029386` is seeded empty on purpose. |
| `src/components/ui/*` | The shadcn/ui primitives — Button, Input, Label, Select, Card, Table, Badge, Alert, Skeleton | Standard, accessible components. The room composes them; nobody styles a `<button>` from scratch today. |
| `src/components/BalanceCard.tsx`, `MutationTable.tsx`, `EmptyState.tsx`, `ErrorBanner.tsx`, `Field.tsx`, `Pagination.tsx`, `TypeFilter.tsx`, `Skeleton.tsx`, `StepBadge.tsx` | The bank's presentational components, built on the primitives above | Presentational components take input as props and never fetch. They are given so each step is about the container that uses them, not about markup. |
| `src/components/StepPlaceholder.tsx` | The dashed card every unbuilt screen renders | It is why `localhost:3000` shows something coherent from minute one. |

Everything in this table is safe to read but is not the point of any step.
What each step below adds is what is missing.

---

## Step 1 — Server Components and the accounts list

**Session 1 · ~30 minutes · `src/app/page.tsx`**

**Build** Render one row per account — customer name, account number, and
balance formatted with `formatIDR` — each linking to `/accounts/{accountNumber}`.
`api.listAccounts()` is already written and typed. Decide where the read
should happen, and build the page so the list is already there before any
client-side JavaScript runs.

**Done when**
- The three seeded accounts render, with balances formatted as `Rp 500.000`.
- View source shows the customer names already in the HTML.
- The page still renders with JavaScript disabled.

## Step 2 — Static rendering and the route table

**Session 1 · ~15 minutes · `src/app/product/page.tsx`**

**Build** Write a page with no dynamic data — the product's name, rate and
terms. Decide how this route's rendering should be configured, given that
nothing on it changes per request, then run `npm run build` and read the
printed route table.

**Done when**
- `npm run build` marks `/product` static and every `/accounts` route dynamic.
- You can say in one sentence why a balance must never be rendered at build
  time.

## Step 3 — Dynamic route, a typed read, and the first failure

**Session 2 · ~20 minutes · `src/app/accounts/[accountNumber]/page.tsx`**

**Build** Read the account with `api.getAccount` and render `BalanceCard`.
Decide how an account number that does not exist should be handled — the API
already tells you the difference between "not found" and every other kind of
failure; make sure your page shows the customer that difference, rather than
one generic banner for everything.

**Done when**
- A seeded account number renders the navy balance card.
- An unknown account number renders `not-found.tsx`, not a stack trace.
- The API base URL appears nowhere in the browser's network tab.

## Step 4 — The three states of a collection

**Session 2 · ~20 minutes · `page.tsx`, `loading.tsx`**

**Build** Add the mutations table below `BalanceCard`, and a `loading.tsx`
beside `page.tsx`. A list screen has more than one state before it is
"loaded" — decide what the customer should see while it is fetching, and
what they should see when there is no history yet (`DKI-1029386` is seeded
empty on purpose).

**Done when**
- A throttled reload (Slow 4G in devtools) shows a skeleton before the table.
- `DKI-1029386` renders a designed empty state, not a blank table.

## Step 5 — Pagination and filtering, in the URL

**Session 2 · ~20 minutes · `page.tsx`**

**Build** Add page and type controls to the mutations list. Decide where
that state should live so that a link to a specific page and filter is
shareable, bookmarkable, and works correctly with the browser's back button.
Make sure a `?size=1000` still shows a handled error rather than breaking the
screen.

**Done when**
- `?page=` and `?type=` both work typed directly into the address bar, and
  compose.
- The back button walks through page changes correctly.
- `?size=1000` shows a handled 422, not a crash.

## Step 6 — The first Server Action

**Session 3 · ~25 minutes · `transact-state.ts`, `actions.ts`, `TransactForm.tsx`**

**Build** A deposit/withdrawal form using the shadcn `Select`, `Input`,
`Label` and `Button` primitives already in `components/ui/`. Decide where
the write to the API happens, and how much of the page needs to be
interactive to support it — the smaller that boundary, the less JavaScript
ships to the browser. The balance shown above the form must update once the
write succeeds, without a full page reload.

**Done when**
- A deposit succeeds and the balance above the form updates without a reload.
- Only one file in this step carries `"use client"`.

## Step 7 — 422, 409, and idempotency

**Session 3 · ~30 minutes · `TransactForm.tsx`, `page.tsx`**

**Build** Handle what the API already tells you about a failed transaction.
Some failures belong to one field; others don't — decide how each should be
shown to the customer. Then make sure a customer who submits the same
transaction twice by accident (a slow network, a double click) cannot move
money twice.

```bash
KEY=$(uuidgen)
for i in 1 2; do
  curl -s -X POST localhost:3000/api/v1/accounts/DKI-1029385/transact     -H "Idempotency-Key: $KEY"     -d '{"type":"WITHDRAWAL","amount":50000,"channel":"CASH"}'
done
# check: does the balance fall by 50.000 once, or twice?
```

**Done when**
- A zero amount shows a field-level error under the amount input.
- An over-large withdrawal shows a form-level banner; the amount stays typed.
- The same `Idempotency-Key`, submitted twice, moves the balance once.

## Step 8 — Open an account, and redirect

**Session 4 · ~25 minutes · `new-account-state.ts`, `actions.ts`, `page.tsx`**

**Build** Build the account-opening screen against `POST /api/v1/accounts`.
Create `new-account-state.ts` and `actions.ts` beside this file, render the
two fields with the `Field` component, and redirect to the new account on
success. The form should render the API's message against the API's field
name, not define its own validity rule that could disagree with it. Where
you call `redirect()` relative to your `try`/`catch` matters — test the
failure paths as carefully as the success path before calling this one done.

**Done when**
- A short NIK errors against the NIK field only.
- A duplicate NIK shows a form-level banner, not a field error.
- A valid submission redirects to the new account, and the redirect is not
  swallowed by the `catch` block.

## Step 9 — Streaming, and a measured case

**Session 4 · ~30 minutes to build, ~20 minutes to measure**
**`MutationsClient.tsx`, `page.tsx`**

**Build** First, build `MutationsClient.tsx` deliberately as a client
component that fetches its own mutations with `useEffect`, and wire it into
the account page in place of the server-rendered table. This is not a
mistake to fix quietly — it is the "before" you measure against, and it
stays in the repository once the fast version exists. Then decide how to let
the balance ship in the first response while the history streams in behind
it.

**Record, under stated conditions** `npm run build && npm start`, Slow 4G,
4x CPU throttling, an incognito window. Record LCP, INP, CLS and First Load
JS for both versions, one change at a time, and write down the throttling
settings next to the numbers.

**Done when**
- The client-fetch waterfall is visible in devtools, and kept as the recorded
  starting point.
- The second version ships the balance before the history arrives, and the
  layout does not jump when the table appears.
- A one-page write-up states before, after, the change that mattered, one
  that did not, and the trade-off.

---

## Falling behind

`catch-up.sh N` copies the finished files for steps 1 through N out of
`jakone-frontend-final/steps/` and over the local tree. It replaces anything
written in those files, so commit first if a version is worth keeping.

```bash
./catch-up.sh 5        # apply steps 1 through 5
./catch-up.sh 5 5      # apply step 5 only
REFERENCE=/path/to/jakone-frontend-final ./catch-up.sh 9   # if unpacked elsewhere
```
