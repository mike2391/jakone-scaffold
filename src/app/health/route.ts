import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * The same runtime probe the Day 7 pipeline calls on the real backend.
 * Keeping it here means the smoke test script does not change on Day 7.
 */
export async function GET() {
  return NextResponse.json({ status: "UP", service: "jakone-frontend-mock" });
}
