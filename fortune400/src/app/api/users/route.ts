// api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ success: false, message: "UID required" }, { status: 400 });
  }

  try {
    // ✅ Corrected query: customer table with correct column casing
    const result = await pool.query(
      `SELECT "cID" FROM customer WHERE "firebase_uid" = $1`,
      [uid]
    );

    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, cID: result.rows[0].cID });
    } else {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Database query error detail:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: "Database error", details: error.message },
      { status: 500 }
    );
  }
}
