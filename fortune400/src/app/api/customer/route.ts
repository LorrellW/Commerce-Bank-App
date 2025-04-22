// /api/customer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";

export async function GET(req: NextRequest) {
  const cidHeader = req.headers.get("x-user-cid");

  if (!cidHeader || Number.isNaN(+cidHeader))
    return NextResponse.json(
      { success: false, message: "Missing or bad x-user-cid header" },
      { status: 400 }
    );

  const cID = Number(cidHeader);

  const client = await pool.connect();
  try {
    /* ─────────── customer + name + address ─────────── */
    const { rows: custRows } = await client.query(`
      SELECT
        c."cID",
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
      FROM customer  c
      JOIN name      n ON n."nameID"    = c."nameID"
      JOIN address   a ON a."addressID" = c."addressID"
      WHERE c."cID" = $1
    `, [cID]);

    if (!custRows.length)
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );

    /* ─────────── accounts ─────────── */
    const { rows: accounts } = await client.query(`
      SELECT "accountID","accountType","creationDate","closeDate","balance"
      FROM account
      WHERE "cID" = $1
      ORDER BY "accountID"
    `, [cID]);

    /* ─────────── transactions (all accounts) ─────────── */
    const { rows: transactions } = await client.query(`
      SELECT t.*
      FROM transactions t
      JOIN account a ON a."accountID" = t."accountID"
      WHERE a."cID" = $1
      ORDER BY t."tDate" DESC, t."tID" DESC
    `, [cID]);

    return NextResponse.json({
      success: true,
      customer: custRows[0],
      accounts,
      transactions
    });

  } catch (err) {
    console.error("GET /api/customer error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}