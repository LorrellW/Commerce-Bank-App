import { pool } from "@/app/db/dbConnect";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cID = request.headers.get("x-user-cid");
  
    console.log("cID from headers:", cID);
  
    if (!cID || isNaN(Number(cID))) {
      return NextResponse.json({ success: false, message: "Invalid or missing cID" }, { status: 400 });
    }
  
    try {
      const client = await pool.connect();
  
      const result = await client.query(
        `SELECT "accountID","accountType","balance"
         FROM account WHERE "cID" = $1`,
        [Number(cID)]
      );
  
      client.release();
  
      return NextResponse.json({ success: true, accounts: result.rows });
    } catch (error) {
      console.error("DB error:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }
  