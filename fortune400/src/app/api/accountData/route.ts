// app/api/accountData/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    console.error("Error: Missing userId query parameter");
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();

    console.log(`Fetching data for userId: ${userId}`);

    const accountQuery = await client.query(
      'SELECT * FROM account WHERE user_id = $1', 
      [userId]
    );

    console.log("Account data:", accountQuery.rows);

    const transactionQuery = await client.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 5',
      [userId]
    );

    console.log("Transaction data:", transactionQuery.rows);

    client.release();

    return NextResponse.json({
      account: accountQuery.rows[0],
      transactions: transactionQuery.rows,
    });

  } catch (error) {
    console.error('Error fetching account data:', error);
    return NextResponse.json({ error: 'Unable to fetch data at the moment.' }, { status: 500 });
  }
}
