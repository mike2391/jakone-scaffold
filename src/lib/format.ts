/**
 * Formatting lives in exactly one place. Arithmetic is never done on a
 * formatted string, and a formatted string is never sent back to the API.
 */

const IDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** 500000 -> "Rp 500.000" */
export function formatIDR(rupiah: number): string {
  return IDR.format(rupiah);
}

/** 500000 -> "500.000" (no symbol, for table cells) */
export function formatAmount(rupiah: number): string {
  return new Intl.NumberFormat("id-ID").format(rupiah);
}

const DATETIME = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export function formatDateTime(iso: string): string {
  return DATETIME.format(new Date(iso));
}

/** "2026-09-03T10:02:11+07:00" -> "3 Sep 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}
