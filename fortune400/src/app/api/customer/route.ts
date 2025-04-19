import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";

/* ─ GET  /api/customer  ────────────────────────────
   • expects header   x-user-cid: <number>
   • joins name + address so you get every column      */
export async function GET(req: NextRequest) {
  const cID = req.headers.get("x-user-cid");

  if (!cID || isNaN(Number(cID))) {
    return NextResponse.json({ success: false, message: "Missing or invalid cID" }, { status: 400 });
  }

  const sql = `
    SELECT  c."cID",
            c."email",
            c."phoneNumber",
            c."firebase_uid",
            n."firstName",
            n."lastName",
            a."street",
            a."city",
            a."state",
            a."zip",
            a."country"
    FROM      customer c
    JOIN      name    n ON n."nameID"    = c."nameID"
    JOIN      address a ON a."addressID" = c."addressID"
    WHERE     c."cID" = $1
  `;

  try {
    const { rows } = await pool.query(sql, [Number(cID)]);
    if (!rows.length) {
      return NextResponse.json({ success: false, message: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, customer: rows[0] });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
