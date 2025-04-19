import { NextResponse } from 'next/server';
import { pool } from '@/app/db/dbConnect';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      street,
      city,
      state,
      zip,
      country,
      firebase_uid,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: firstName, lastName, or email.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert into name
      const insertNameQuery = `
        INSERT INTO name ("firstName", "lastName")
        VALUES ($1, $2)
        RETURNING "nameID";
      `;
      const nameResult = await client.query(insertNameQuery, [firstName, lastName]);
      const nameID = nameResult.rows[0].nameID;

      // Insert into address
      const insertAddressQuery = `
        INSERT INTO address ("street", "city", "state", "zip", "country")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING "addressID";
      `;
      const addressResult = await client.query(insertAddressQuery, [street, city, state, zip, country]);
      const addressID = addressResult.rows[0].addressID;

      // Insert into customer
      const insertCustomerQuery = `
        INSERT INTO customer ("nameID", "addressID", "phoneNumber", "email", "firebase_uid")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING "cID";
      `;
      const customerResult = await client.query(insertCustomerQuery, [
        nameID,
        addressID,
        phoneNumber || null,
        email,
        firebase_uid,
      ]);
      const cID = customerResult.rows[0].cID;

      // Insert into account
      const insertAccountQuery = `
      INSERT INTO account ("cID", "accountType", "creationDate", "closeDate", "balance")
      VALUES ($1, $2, CURRENT_DATE, NULL, $3)
      RETURNING "accountID";
    `;
    const accountType = "checking";
    const initialBalance = 500.00;
    
    const accountResult = await client.query(insertAccountQuery, [cID, accountType, initialBalance]);
    const accountID = accountResult.rows[0].accountID;

     // Insert into transactions
    const insertTransactionQuery = `
      INSERT INTO transactions ("accountID", "tDate", "amount", "description")
      VALUES ($1, CURRENT_DATE, $2, $3)
      RETURNING *;
      `;

    const description = "Initial deposit";

    const transactionResult = await client.query(insertTransactionQuery, [
    accountID,         // ✅ Foreign key to account.accountID
    initialBalance,    // 💵 First deposit value
    description        // 📝 Contextual message
    ]);

      await client.query('COMMIT');

      return NextResponse.json(
        {
          success: true,
          message: 'Registration, account, and initial transaction successful.',
          data: {
            customer: customerResult.rows[0],
            account: accountResult.rows[0],
            transaction: transactionResult.rows[0],
          },
        },
        { status: 201 }
      );

    } catch (err: unknown) {
      await client.query('ROLLBACK');
      console.error("Database error:", err);
      return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
    } finally {
      client.release();
    }

  } catch (err: unknown) {
    console.error("Request error:", err);
    return NextResponse.json({ success: false, message: 'Error processing request.' }, { status: 400 });
  }
}
