// // app/pages/Taxes/page.tsx
// "use client";

// import axios from "axios";
// import { useState, useEffect } from "react";

// export default async function TaxesPage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [data, setData] = useState<Record<string, unknown>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const res = await fetch("/api/travel");
//   const { ideas } = await res.json();


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://dummyjson.com/");
//         setData(response.data);
//         setLoading(false);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("An unknown error occurred.");
//         }
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="w-screen h-auto bg-black place-items-center text-white p-6">
//       <div>
//         <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
//         <p className="mb-4">Testing APIs...</p>
//         <pre className="bg-gray-800 p-4 rounded mb-4 overflow-auto">
//           {JSON.stringify(data, null, 2)}
//         </pre>
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-green-600 text-black w-36 h-12 rounded"
//         >
//           Open Modal
//         </button>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
//           <div className="relative bg-white w-96 h-72 rounded-lg p-4">
//             <button
//               className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"
//               onClick={() => setIsOpen(false)}
//             >
//               &times;
//             </button>
//             <div className="flex items-center justify-center text-black text-xl h-full">
//               Modal Content...
//             </div>
//             <button
//               className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-lg w-24 h-10"
//               onClick={() => setIsOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <div></div>
//     </div>
//   );
// }
