// api/users-sync/route.ts

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";

export async function POST(req: NextRequest) {
  const { uid, email, firstName, lastName } = await req.json();

  if (!uid || !email || !firstName || !lastName) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    //‑‑ 1) Already there?
    const { rows } = await client.query(
      `SELECT "cID" FROM customer WHERE "firebase_uid" = $1`,
      [uid]
    );
    if (rows.length) return NextResponse.json({ success: true, cID: rows[0].cID });

    //‑‑ 2) Insert skeleton rows
    await client.query("BEGIN");

    const nameRes = await client.query(
      `INSERT INTO name ("firstName","lastName") VALUES ($1,$2) RETURNING "nameID"`,
      [firstName, lastName]
    );
    const nameID = nameRes.rows[0].nameID;

    const addrRes = await client.query(
      `INSERT INTO address ("street","city","state","zip","country")
       VALUES ('','','','','') RETURNING "addressID"`
    );
    const addressID = addrRes.rows[0].addressID;

    const custRes = await client.query(
      `INSERT INTO customer ("nameID","addressID","email","firebase_uid")
       VALUES ($1,$2,$3,$4) RETURNING "cID"`,
      [nameID, addressID, email, uid]
    );

    await client.query("COMMIT");
    return NextResponse.json({ success: true, cID: custRes.rows[0].cID });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return NextResponse.json({ success: false, message: "DB error" }, { status: 500 });
  } finally {
    client.release();
  }
}
