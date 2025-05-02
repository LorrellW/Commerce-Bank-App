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

// app/(dashboard)/travel/page.tsx
"use client";
import Link from "next/link";
import ThreeCard from "@/app/components/threeCard";
import axios from "axios";

export default function TravelAdvisor() {
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["travelIdeas"],
  //   queryFn: () => axios.get("/api/travel").then(res => res.data.ideas)
  // });

  // if (isLoading) return <p>Loading trip ideas…</p>;
  // if (error)     return <p>Something went wrong.</p>;

  return (
    <div>
          <h1 className="text-black font-serif text-center text-4xl p-5
          ">Y.O.T.A <br/></h1>
          <p className="text-center font-sans"> Your very own travel agent.</p>
          <span className="flex place-content-end pt-6">
          <input className="border-2 border-blue-200 text-center"
            placeholder="Local Airport"
            name="Airport">
          </input>

          <input className=" border-2 border-blue-200 text-center mr-20"
            placeholder=" ="
            name="Airport filled in">
            </input>
            </span>
          <ThreeCard />

          <div className="grid grid-cols-3">
            <Link
              className="grid col-start-2 place-items-center justify-self-center bg-blue-600  w-36 h-20" 
              href={'./Taxes'}>Taxes Page
            </Link>

          </div> 
          
     
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* // <article key={trip.title} className="rounded-2xl shadow p-4">
        //   <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
        //   <p className="italic text-sm mb-2">{trip.whyItMatches}</p>
        //   <p className="mb-2">{trip.summary}</p>
        //   <p className="font-semibold">Duration: {trip.days} days</p>
        //   <p className="font-semibold">Est. Cost: ${trip.estCostUSD.toLocaleString()}</p>
        // </article> */}
    </div>
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
