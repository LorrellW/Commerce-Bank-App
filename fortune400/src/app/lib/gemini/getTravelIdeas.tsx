// import { TextGenerationClient } from "@google/genai";
// import { TravelContext } from "@/app/context/getUserTravelContext";

// const gemini = new TextGenerationClient({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// export async function getTravelIdeas(ctx: TravelContext) {
//   const prompt = `
// You are a concise travel-planning assistant. Given this user context:
// ${JSON.stringify(ctx, null, 2)}

// Return exactly 3 trip ideas as JSON in the form:

// {
//   "ideas": [
//     {
//       "title": string,
//       "summary": string,
//       "days": number,
//       "estCostUSD": number,
//       "whyItMatches": string
//     },
//     … (3 total)
//   ]
// }

// Do not wrap your JSON in markdown or extra text—output raw JSON only.
//   `.trim();

//   const resp = await gemini.generateText({
//     model: "gemini-pro-1",   // or whichever model you’re on
//     prompt,
//     temperature: 0.7,
//     maxOutputTokens: 1024,
//   });

//   let parsed: { ideas: any[] };
//   try {
//     parsed = JSON.parse(resp.text);
//   } catch (e) {
//     throw new Error(
//       "Failed to parse Gemini response as JSON:\n" + resp.text
//     );
//   }
//   return parsed.ideas;
// }