// src/app/api/gemini-transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Pool }                 from "pg";
import { GoogleGenAI }          from "@google/genai";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ai   = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(req: NextRequest) {
  const url       = new URL(req.url);
  const acctParam = url.searchParams.get("accountID");
  if (!acctParam) {
    return NextResponse.json({ error: "Missing accountID" }, { status: 400 });
  }
  const accountID = Number(acctParam);

  // 1) fetch your transactions
  const client = await pool.connect();
  let txs = [];
  try {
    const { rows } = await client.query(
      `SELECT "tID","tDate", amount, description, category, merchant
         FROM transactions
        WHERE "accountID" = $1
        ORDER BY "tDate" DESC`,
      [accountID]
    );
    txs = rows;
  } finally {
    client.release();
  }

  // 2) prompt Gemini, force RAW JSON
  const prompt = `
Here are my transactions:
${JSON.stringify(txs)}

Respond with pure JSON, no markdown fences.  Format:

{
  "categories": {
    "<cat1>": [ /* array of tx objects */ ],
    "<cat2>": [ … ]
  }
}
  `.trim();

  const resp = await ai.models.generateContent({
    model:    "gemini-2.0-flash-exp",
    contents: prompt,
  });

  // 3) pull the raw text
  const raw = resp.text ?? "";

  // 4) strip any fences if they sneaked in
  const withoutFences = raw
    .replace(/^```json\s*/, "")
    .replace(/```$/, "")
    .trim();

  // 5) parse
  let categories: Record<string, any[]> = {};
  try {
    const parsed = JSON.parse(withoutFences);
    categories = parsed.categories;
    if (typeof categories !== "object") {
      throw new Error("`categories` not an object");
    }
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed to parse AI JSON", details: e.message, raw },
      { status: 500 }
    );
  }

  return NextResponse.json({ categories });
}
