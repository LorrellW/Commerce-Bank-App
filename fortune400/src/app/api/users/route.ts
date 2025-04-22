// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";

export async function GET(req: NextRequest) {
  const uid = new URL(req.url).searchParams.get("uid");

  if (!uid) {
    return NextResponse.json(
      { success: false, message: "UID required" },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `SELECT "cID" FROM customer WHERE "firebase_uid" = $1`,
      [uid]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cID: rows[0].cID });
  } catch (err: unknown) {
    /* ↓ type‑guard only when we need the message */
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Database query error:", msg, err);
    return NextResponse.json(
      { success: false, message: "Database error", details: msg },
      { status: 500 }
    );
  }
}
