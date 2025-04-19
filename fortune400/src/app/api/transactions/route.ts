import { pool } from "@/app/db/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const accountID = request.headers.get("x-account-id");

  if (!accountID || isNaN(Number(accountID))) {
    return NextResponse.json({ success: false, message: "Invalid or missing accountID" }, { status: 400 });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT "tID", "tDate", "amount", "description"
       FROM transactions
       WHERE "accountID" = $1
       ORDER BY "tDate" DESC`,
      [Number(accountID)]
    );

    client.release();

    return NextResponse.json({ success: true, transactions: result.rows });
  } catch (error) {
    console.error("DB error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
