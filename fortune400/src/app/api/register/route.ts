// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/app/db/dbConnect";

export async function POST(req: Request) {
  const body = await req.json();

  /* ───── basic validation ───── */
  const {
    firstName, lastName, email,
    phoneNumber,
    street, city, state, zip, country,
    firebase_uid                           // ← sent by the client
  } = body;

  if (!firstName || !lastName || !email || !firebase_uid) {
    return NextResponse.json(
      { success: false, message: "Missing firstName, lastName, email or firebase_uid" },
      { status: 400 }
    );
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    /* ───── 1) name ───── */
    const nameRes = await client.query(
      `INSERT INTO name ("firstName", "lastName")
       VALUES ($1, $2) RETURNING "nameID"`,
      [firstName, lastName]
    );
    const nameID = nameRes.rows[0].nameID;

    /* ───── 2) address ───── */
    const addrRes = await client.query(
      `INSERT INTO address ("street","city","state","zip","country")
       VALUES ($1,$2,$3,$4,$5) RETURNING "addressID"`,
      [street, city, state, zip, country]
    );
    const addressID = addrRes.rows[0].addressID;

    /* ───── 3) customer ───── */
    const custRes = await client.query(
      `INSERT INTO customer ("nameID","addressID","phoneNumber","email","firebase_uid")
       VALUES ($1,$2,$3,$4,$5)
       RETURNING "cID"`,
      [nameID, addressID, phoneNumber ?? null, email, firebase_uid]
    );
    const cID = custRes.rows[0].cID;

    /* ───── 4) account (first current/checking account) ───── */
    const accountType   = "checking";
    const initialAmount = 500.00;

    const accRes = await client.query(
      `INSERT INTO account ("cID","accountType","creationDate","balance")
       VALUES ($1,$2,CURRENT_DATE,$3)
       RETURNING "accountID","balance","accountType"`,
      [cID, accountType, initialAmount]
    );
    const accountID = accRes.rows[0].accountID;

    /* ───── 5) first transaction (initial deposit) ───── */
    const txRes = await client.query(
      `INSERT INTO transactions ("accountID","tDate","amount","description")
       VALUES ($1,CURRENT_DATE,$2,$3)
       RETURNING *`,
      [accountID, initialAmount, "Initial deposit"]
    );

    await client.query("COMMIT");

    /* ───── success payload ───── */
    return NextResponse.json(
      {
        success: true,
        customer:   { cID },
        account:    accRes.rows[0],
        transaction: txRes.rows[0]
      },
      { status: 201 }
    );

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Registration error:", err);
    return NextResponse.json(
      { success: false, message: "Database error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
