import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";  // same pool you use elsewhere :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

export async function GET(req: NextRequest) {
  // 1️⃣ Read the Firebase UID from query string
  const uid = new URL(req.url).searchParams.get("uid");
  if (!uid) {
    return NextResponse.json(
      { success: false, message: "Missing uid parameter" },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    // 2️⃣ Join customer→name tables to get cID + first/last names
    const { rows } = await client.query<{
      cID: number;
      firstName: string;
      lastName: string;
    }>(
      `SELECT 
         c."cID",
         n."firstName",
         n."lastName"
       FROM customer c
       JOIN name     n ON n."nameID" = c."nameID"
       WHERE c."firebase_uid" = $1`,
      [uid]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Return exactly the shape your LoginModal expects
    return NextResponse.json({
      success:  true,
      customer: rows[0]
    });
  } catch (err) {
    console.error("GET /api/getCustomer error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}