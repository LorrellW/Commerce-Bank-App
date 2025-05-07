// app/(dashboard)/travel/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import Protected from "@/app/components/Protected";
import { useUser } from "@/app/context/UserContext"; // your auth hook
import Image from "next/image";
import GYA from "../../../../public/gemini-yota-avatar.jpg"
import GYL from "../../../../public/gemini-yota-letters.jpg"

export default function TravelAdvisor() {
  const { user } = useUser();
  const isAuthenticated = Boolean(user);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setReply(null);

    try {
      const res = await axios.post<{ text: string }>(
        "/api/gemini",
        { prompt },
      );
      setReply(res.data.text);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected isAuthenticated={isAuthenticated}>
      <div className="p-8 bg-blue-500 max-w-xl h-auto mx-auto">

        <Image src={GYA}
        alt="gemini generated "
        className="object-contain">
      
        </Image>

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
    </Protected>
  );
}
