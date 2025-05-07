import { NextResponse } from "next/server";

type QuoteJson = { price: number | null; change: number | null; error?: string };

export async function GET(req: Request) {
  const sym = new URL(req.url).searchParams.get("sym")?.toUpperCase() ?? "";
  const key = process.env.FINNHUB_API_KEY;

  if (!key) {
    return NextResponse.json<QuoteJson>(
      { price: null, change: null, error: "Missing FINNHUB_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${key}`;
    const q   = await fetch(url).then(r => r.json());

    /* Finnhub returns zeros for unknown symbols */
    if (!q || q.c === 0) {
      return NextResponse.json<QuoteJson>(
        { price: null, change: null, error: "symbol not found" },
        { status: 404 }
      );
    }

    const changePct = ((q.c - q.pc) / q.pc) * 100;
    return NextResponse.json<QuoteJson>({ price: q.c, change: changePct });
  } catch (err:any) {
    return NextResponse.json<QuoteJson>(
      { price: null, change: null, error: err.message },
      { status: 500 }
    );
  }
}
