// import { NextRequest, NextResponse } from "next/server";
// import { Pool } from "pg";
// import OpenAI from "openai";

// // 1 ── DB init (one global pool per server process) ────────────────
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // optional: ssl: { rejectUnauthorized: false }   // e.g. on Supabase
// });

// // 2 ── Types ───────────────────────────────────────────────────────
// interface DBRow {
//   userid: number;
//   city: string;
//   state: string | null;
//   country: string;
//   max_trip_days: number;
//   fav_climate: string;
//   adventure_lvl: number;
//   airline_miles: number;
//   hotel_points: number;
//   monthly_travel_spend: number;
//   monthly_total_spend: number;
// }

// interface TravelContext {
//   homeAirport: string;
//   maxTripDays: number;
//   monthlyTravelSpend: number;
//   monthlyTotalSpend: number;
//   preferences: {
//     favClimate: string;
//     adventureLevel: number;
//   };
//   miles: number;
//   points: number;
// }

// // 3 ── Helper: build context for a user ────────────────────────────
// async function getTravelContext(userId: number): Promise<TravelContext> {
//   const client = await pool.connect();
//   try {
//     // 3-a  fetch row from the view
//     const { rows } = await client.query<DBRow>(
//       `SELECT * FROM vw_travel_context WHERE userid = $1 LIMIT 1`,
//       [userId]
//     );
//     if (!rows[0]) throw new Error("User context not found");

//     const r = rows[0];

//     // 3-b  derive homeAirport
//     const { rows: airportRows } = await client.query<{ iata: string }>(
//       `SELECT iata
//          FROM airport
//         WHERE lower(city) = lower($1)
//           AND lower(country) = lower($2)
//         ORDER BY passengers DESC NULLS LAST
//         LIMIT 1`,
//       [r.city, r.country]
//     );
//     const homeAirport = airportRows[0]?.iata ?? "UNK";

//     // 3-c  hydrate TS object
//     return {
//       homeAirport,
//       maxTripDays: r.max_trip_days,
//       monthlyTravelSpend: Number(r.monthly_travel_spend),
//       monthlyTotalSpend: Number(r.monthly_total_spend),
//       preferences: {
//         favClimate: r.fav_climate,
//         adventureLevel: r.adventure_lvl,
//       },
//       miles: r.airline_miles,
//       points: r.hotel_points,
//     };
//   } finally {
//     client.release();
//   }
// }

// // 4 ── OpenAI helper ───────────────────────────────────────────────
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function askOpenAI(ctx: TravelContext) {
//   const functions = [
//     {
//       name: "proposed_trip",
//       description: "Single trip idea tailored to the user",
//       parameters: {
//         type: "object",
//         properties: {
//           title: { type: "string" },
//           summary: { type: "string" },
//           days: { type: "integer" },
//           estCostUSD: { type: "number" },
//           whyItMatches: { type: "string" },
//         },
//         required: ["title", "summary", "days", "estCostUSD", "whyItMatches"],
//       },
//     },
//   ];

//   const resp = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     temperature: 0.7,
//     functions,
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a concise travel-planning assistant. Answer only via function calls.",
//       },
//       {
//         role: "user",
//         content: `Here is my travel context (JSON):\n${JSON.stringify(ctx)}\n
//                   Suggest exactly 3 trip ideas whose durations do not exceed ${ctx.maxTripDays} days.`,
//       },
//     ],
//   });

//   // pull out up to 3 function-call argument JSON blobs
//   return resp.choices
//     .flatMap((c) =>
//       c.message.function_call?.arguments
//         ? [JSON.parse(c.message.function_call.arguments)]
//         : []
//     )
//     .slice(0, 3);
// }

// // 5 ── API route handler ───────────────────────────────────────────
// export async function GET(req: NextRequest) {
//   try {
//     /* TODO: replace stub with real auth */
//     const userId = 1; // e.g. req.headers.get("x-user-id")

//     const ctx = await getTravelContext(userId);
//     const ideas = await askOpenAI(ctx);

//     return NextResponse.json({ ideas });
//   } catch (err: any) {
//     console.error("travel-advisor error", err);
//     return NextResponse.json(
//       { error: err.message ?? "unexpected" },
//       { status: 500 }
//     );
//   }
// }

// app/api/travel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTravelContext } from "@/app/context/getUserTravelContext";
import { getTravelIdeas } from "@/lib/ai/getTravelIdeas";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id")!; // or session cookie
  const ctx = await getTravelContext(userId);
  const ideas = await getTravelIdeas(ctx);
  return NextResponse.json({ ideas });
}

