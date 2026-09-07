# jakone-frontend-scaffold

**The base everybody codes in for Day 4.** It boots on the first minute and
nine screens are missing. Each one renders a dashed placeholder card that
prints its own brief and its own acceptance checks until it is built.

```bash
npm install
npm run dev        # http://localhost:3000
```

## What is already here

The mock API, the typed API client, the formatting rules, and the bank's
presentational components — all built on shadcn/ui primitives already
installed under `src/components/ui/`. Nothing about styling a `<button>` or
setting up shadcn/ui is today's work; composing it into nine screens is.

`WALKTHROUGH.md` lists every given file and why it is given, then walks the
nine steps in order: the file, what to build, and the checks each step is
done against.

## Falling behind

```bash
./catch-up.sh 5        # apply steps 1 through 5
./catch-up.sh 5 5      # apply step 5 only
```

It copies the finished files for those steps out of `jakone-frontend-final`,
unpacked beside this folder, and over the local tree. Anything written in
those files is replaced, so commit first if a version is worth keeping. Point
`REFERENCE` elsewhere if the reference repository is unpacked somewhere else.

## Commands

| | |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build and the route table |
| `npm start` | serve the production build |

## The nine steps

| Step | Screen | Session |
|---|---|---|
| 1 | The accounts list, as a Server Component | 1 |
| 2 | A static route, and the route table | 1 |
| 3 | A dynamic route, a typed read, and the first failure | 2 |
| 4 | The three states of a collection | 2 |
| 5 | Pagination and filtering, in the URL | 2 |
| 6 | The first Server Action | 3 |
| 7 | 422, 409, and idempotency | 3 |
| 8 | Open an account, and redirect | 4 |
| 9 | Streaming, and a measured case | 4 |

`jakone-frontend-final` is the answer key, with a snapshot of every file at
the end of every step.
"# jakone-scaffold" 
