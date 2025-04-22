//src\app\api\users\route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";

/**
 *  GET /api/users?uid=<firebase_uid>
 *
 *  ➜ { success:true, cID:number }
 */
export async function GET(req: NextRequest) {
  /* ------------------------------------------------------------------ */
  /* 1 ─ validate query‑string                                           */
  /* ------------------------------------------------------------------ */
  const uid = new URL(req.url).searchParams.get("uid");
  if (!uid) {
    return NextResponse.json(
      { success: false, message: "UID required" },
      { status: 400 },
    );
  }

  /* ------------------------------------------------------------------ */
  /* 2 ─ look‑up customer                                               */
  /* ------------------------------------------------------------------ */
  try {
    const { rows } = await pool.query<
      { cID: number }                       // <- row type for auto‑hinting
    >(
      `SELECT "cID"
         FROM customer
        WHERE "firebase_uid" = $1`,
      [uid],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, cID: rows[0].cID });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("DB error (users):", msg, err);   // <- safe log
    return NextResponse.json(
      { success: false, message: "Database error", details: msg },
      { status: 500 },
    );
  }
}
