/**
 * scripts/smoke.mjs — the shared JakOne contract, checked from the outside.
 *
 *   npm run build && npm start &
 *   npm run smoke
 *
 * The same script runs against the mock in this repository and against the
 * Spring Boot service later in the programme. If it passes against both, the
 * contract agreed on the system design day actually held.
 *
 *   BASE=http://localhost:8080 npm run smoke
 */
const BASE = process.env.BASE ?? "http://localhost:3000";

let pass = 0;
let fail = 0;

function check(name, condition, detail = "") {
  if (condition) {
    pass += 1;
    console.log(`  ok   ${name}`);
  } else {
    fail += 1;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function call(method, path, body, headers = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, body: json, headers: res.headers };
}

console.log(`JakOne contract smoke test against ${BASE}\n`);

// ------------------------------------------------------------------ health
{
  const r = await call("GET", "/health");
  check("GET /health answers 200", r.status === 200, `got ${r.status}`);
  check("health reports UP", r.body?.status === "UP");
}

// ------------------------------------------------------------- read account
console.log("\nGET /api/v1/accounts/{accountNumber}");
{
  const r = await call("GET", "/api/v1/accounts/DKI-1029384");
  check("seeded account is readable", r.status === 200, `got ${r.status}`);
  check("balance is a whole number", Number.isInteger(r.body?.balance));
  check("currency is IDR", r.body?.currency === "IDR");

  const missing = await call("GET", "/api/v1/accounts/DKI-9999999");
  check("unknown account is 404", missing.status === 404, `got ${missing.status}`);
  check(
    "404 carries code ACCOUNT_NOT_FOUND",
    missing.body?.code === "ACCOUNT_NOT_FOUND",
  );
}

// ----------------------------------------------------------- create account
console.log("\nPOST /api/v1/accounts");
let createdAccountNumber = null;
{
  const bad = await call("POST", "/api/v1/accounts", {
    customerNik: "123",
    customerName: "X",
  });
  check("short NIK is 422", bad.status === 422, `got ${bad.status}`);
  check("422 names the offending fields", Array.isArray(bad.body?.errors));
  check(
    "422 names customerNik",
    (bad.body?.errors ?? []).some((e) => e.field === "customerNik"),
  );

  const nik = String(3171012345670000 + Math.floor(Math.random() * 8999) + 1000);
  const ok = await call("POST", "/api/v1/accounts", {
    customerNik: nik,
    customerName: "Peserta ODP",
  });
  check("valid request is 201", ok.status === 201, `got ${ok.status}`);
  check("response carries a Location header", Boolean(ok.headers.get("location")));
  check("new account opens at zero", ok.body?.balance === 0);
  createdAccountNumber = ok.body?.accountNumber ?? null;

  const dupe = await call("POST", "/api/v1/accounts", {
    customerNik: nik,
    customerName: "Peserta ODP",
  });
  check("repeated NIK is 409", dupe.status === 409, `got ${dupe.status}`);
}

// ---------------------------------------------------------------- transact
console.log("\nPOST /api/v1/accounts/{accountNumber}/transact");
{
  const acct = createdAccountNumber ?? "DKI-1029384";

  const deposit = await call("POST", `/api/v1/accounts/${acct}/transact`, {
    type: "DEPOSIT",
    amount: 250000,
    channel: "CASH",
  });
  check("deposit is 201", deposit.status === 201, `got ${deposit.status}`);
  check("deposit returns the resulting balance", Number.isInteger(deposit.body?.resultingBalance));

  const over = await call("POST", `/api/v1/accounts/${acct}/transact`, {
    type: "WITHDRAWAL",
    amount: 999999999,
    channel: "CASH",
  });
  check("overdraft is 409", over.status === 409, `got ${over.status}`);
  check("409 carries code INSUFFICIENT_FUNDS", over.body?.code === "INSUFFICIENT_FUNDS");

  const negative = await call("POST", `/api/v1/accounts/${acct}/transact`, {
    type: "DEPOSIT",
    amount: -1,
    channel: "CASH",
  });
  check("negative amount is 422", negative.status === 422, `got ${negative.status}`);

  const unknownType = await call("POST", `/api/v1/accounts/${acct}/transact`, {
    type: "TRANSFER",
    amount: 1000,
    channel: "CASH",
  });
  check("unknown type is 422", unknownType.status === 422, `got ${unknownType.status}`);

  const key = `smoke-${Date.now()}`;
  const first = await call(
    "POST",
    `/api/v1/accounts/${acct}/transact`,
    { type: "DEPOSIT", amount: 10000, channel: "QRIS" },
    { "Idempotency-Key": key },
  );
  const replay = await call(
    "POST",
    `/api/v1/accounts/${acct}/transact`,
    { type: "DEPOSIT", amount: 10000, channel: "QRIS" },
    { "Idempotency-Key": key },
  );
  check(
    "the same Idempotency-Key does not move money twice",
    first.body?.resultingBalance === replay.body?.resultingBalance,
    `${first.body?.resultingBalance} then ${replay.body?.resultingBalance}`,
  );
  check(
    "the replay returns the original mutation id",
    first.body?.mutationId === replay.body?.mutationId,
  );
}

// ---------------------------------------------------------------- mutations
console.log("\nGET /api/v1/accounts/{accountNumber}/mutations");
{
  const p0 = await call("GET", "/api/v1/accounts/DKI-1029385/mutations?page=0&size=5");
  check("first page is 200", p0.status === 200, `got ${p0.status}`);
  check("page holds at most size rows", (p0.body?.content ?? []).length <= 5);
  check("totalPages is reported", Number.isInteger(p0.body?.totalPages));
  check("more than one page of seed history", (p0.body?.totalPages ?? 0) > 1);

  const sorted = (p0.body?.content ?? []).every(
    (m, i, a) => i === 0 || Date.parse(a[i - 1].createdAt) >= Date.parse(m.createdAt),
  );
  check("rows are newest first", sorted);

  const filtered = await call(
    "GET",
    "/api/v1/accounts/DKI-1029385/mutations?type=DEPOSIT&size=100",
  );
  check(
    "type filter returns only deposits",
    (filtered.body?.content ?? []).every((m) => m.transactionType === "DEPOSIT"),
  );

  const empty = await call("GET", "/api/v1/accounts/DKI-1029386/mutations");
  check("an account with no history is 200 with an empty page", empty.status === 200 && (empty.body?.content ?? []).length === 0);

  const badSize = await call("GET", "/api/v1/accounts/DKI-1029385/mutations?size=5000");
  check("an out-of-range size is 422", badSize.status === 422, `got ${badSize.status}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
