// app/api/register/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/db/dbConnect';

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
    } = body;
    
    // Ensure required fields exist.
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: firstName, lastName, or email.' },
        { status: 400 }
      );
    }
    
    // Get a client from the connection pool.
    const client = await pool.connect();
    
    try {
      // Begin transaction.
      await client.query('BEGIN');
      
      // 1. Insert into the name table.
      const insertNameQuery = `
        INSERT INTO name ("firstName", "lastName")
        VALUES ($1, $2)
        RETURNING "nameID";
      `;
      const nameResult = await client.query(insertNameQuery, [firstName, lastName]);
      const nameID = nameResult.rows[0].nameID;
      
      // 2. Insert into the address table.
      const insertAddressQuery = `
        INSERT INTO address ("street", "city", "state", "zip", "country")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING "addressID";
      `;
      const addressResult = await client.query(insertAddressQuery, [street, city, state, zip, country]);
      const addressID = addressResult.rows[0].addressID;
      
      // 3. Insert into the customer table.
      const insertCustomerQuery = `
        INSERT INTO customer ("nameID", "addressID", "phoneNumber", "email")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const customerResult = await client.query(insertCustomerQuery, [nameID, addressID, phoneNumber || null, `{${email}}`]);
      
      // Commit the transaction.
      await client.query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: "Registration details saved successfully.",
        data: customerResult.rows[0],
      }, { status: 201 });
      
    } catch (error: any) {
      // Rollback on error.
      await client.query('ROLLBACK');
      console.error("Database error:", error);
      return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error("Request processing error:", error);
    return NextResponse.json({ success: false, message: "Error processing request." }, { status: 400 });
  }
}
