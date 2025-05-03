// app/api/gemini/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,  // make sure this is in your .env.local
});

export async function POST(request: Request) {
  const { prompt } = await request.json();
  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  // generate raw text from Gemini
  const resp = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",  // or the model you want
    contents: prompt,
  });

  return NextResponse.json({ text: resp.text });
}