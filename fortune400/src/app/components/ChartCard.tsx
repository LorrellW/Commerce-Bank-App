import { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
export function ChartCard(
  { title, children, height = 240, wide = false }:
  { title: string; children: React.ReactNode; height?: number; wide?: boolean }
) {
  return (
    <div className={`bg-gray-900 rounded p-4 ${wide ? "lg:col-span-2" : ""}`}>
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
      {children as ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
