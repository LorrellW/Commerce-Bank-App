// // app/(dashboard)/travel/page.tsx
// "use client";

// import OpenAI from "openai";
// import { useEffect, useState } from "react";

// // ─────────────────────────────────────────────────────────────
// // Types that match /api/travel JSON
// // ─────────────────────────────────────────────────────────────
// type TripIdea = {
//   title: string;
//   summary: string;
//   days: number;
//   estCostUSD: number;
//   whyItMatches: string;
// };

// export default async function TravelAdvisorPage() {
//   const [ideas, setIdeas]   = useState<TripIdea[] | null>(null);
//   const [error, setError]   = useState<string | null>(null);
//   const [loading, setLoad]  = useState(true);
//   const client = new OpenAI();

//   const response = await client.responses.create({
//     model: "gpt-4.1",
//     input: "Write a one-sentence bedtime story about a unicorn.",
// });

// console.log(response.output_text);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/api/travel");
//         if (!res.ok) throw new Error(`API ${res.status}`);
//         const json = await res.json();
//         setIdeas(json.ideas);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoad(false);
//       }
//     })();
//   }, []);

//   // ── loading & error states ───────────────────────────────
//   if (loading) return <p className="p-8 text-lg">Fetching trip ideas…</p>;
//   if (error)   return <p className="p-8 text-red-600">Error: {error}</p>;
//   if (!ideas?.length) return <p className="p-8">No ideas returned.</p>;

//   // ── render cards ─────────────────────────────────────────
//   return (
//     <div className="p-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//       {ideas.map((trip) => (
//         <article
//           key={trip.title}
//           className="rounded-2xl shadow-lg bg-white dark:bg-neutral-900 p-6 flex flex-col"
//         >
//           <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>

//           <p className="text-sm italic mb-3">{trip.whyItMatches}</p>

//           <p className="flex-1 mb-4">{trip.summary}</p>

//           <div className="flex items-center justify-between font-medium">
//             <span>{trip.days} days</span>
//             <span>${trip.estCostUSD.toLocaleString()}</span>
//           </div>
//           <button
//   onClick={() => location.reload()}
//   className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
// >
//   Refresh ↻
// </button>
//         </article>
//       ))}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import axios from "axios";

export default function TravelAdvisor() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setReply(null);

    try {
      const res = await axios.post<{ text: string }>("/api/gemini", {
        prompt,
      });
      setReply(res.data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gemini Playground</h1>

      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Type anything—e.g. “Tell me a unicorn bedtime story.”"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !prompt.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Thinking…" : "Submit"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {reply && (
        <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {reply}
        </pre>
      )}
    </div>
  );
}



// 

// export default function TravelAgent() {
//     return (
//         <div>
//           <h1 className="text-black font-serif text-center text-4xl p-5
//           ">Y.O.T.A <br/></h1>
//           <p className="text-center font-sans"> Your very own travel agent.</p>
//           <span className="flex place-content-end pt-6">
//           <input className="border-2 border-blue-200 text-center"
//             placeholder="Local Airport"
//             name="Airport">
//           </input>

//           <input className=" border-2 border-blue-200 text-center mr-20"
//             placeholder=" ="
//             name="Airport filled in">
//             </input>
//             </span>
//           <ThreeCard />

//           <div className="grid grid-cols-3">
//             <Link
//               className="grid col-start-2 place-items-center justify-self-center bg-blue-600  w-36 h-20" 
//               href={'./Taxes'}>Taxes Page
//             </Link>

//           </div>
//         </div>
//     );
// }
