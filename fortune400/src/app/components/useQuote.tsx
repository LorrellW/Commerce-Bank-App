import useSWR from "swr";

type QuoteResp = {
  price:  number | null;
  change: number | null;
  error?: string;          // 👈 allow the API route to pass an error note
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useQuote(sym: string) {
  return useSWR<QuoteResp>(
    `/api/quote?sym=${sym}`,
    fetcher,
    { refreshInterval: 30_000 }
  );
}