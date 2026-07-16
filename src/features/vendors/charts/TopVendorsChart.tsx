import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  data: {
    vendor: string;
    invoiceCount: number;
  }[];
};

// Color palette for bars
const COLORS = [
  "#3B82F6", // blue-500
  "#6366F1", // indigo-500
  "#8B5CF6", // violet-500
  "#A855F7", // purple-500
  "#D946EF", // fuchsia-500
  "#EC4899", // pink-500
  "#F43F5E", // rose-500
  "#EF4444", // red-500
  "#F59E0B", // amber-500
  "#10B981", // emerald-500
];

const DARK_COLORS = [
  "#60A5FA", // blue-400
  "#818CF8", // indigo-400
  "#A78BFA", // violet-400
  "#C084FC", // purple-400
  "#E879F9", // fuchsia-400
  "#F472B6", // pink-400
  "#FB7185", // rose-400
  "#F87171", // red-400
  "#FBBF24", // amber-400
  "#34D399", // emerald-400
];

export default function TopVendorsChart({
  data,
}: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const colors = isDark ? DARK_COLORS : COLORS;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200/60 bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/90">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {payload[0].payload.vendor}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Invoices:
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {payload[0].value}
            </span>
          </div>
          <div className="mt-1.5 h-px w-full bg-slate-200/60 dark:bg-slate-700/60" />
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {`${Math.round((payload[0].value / data.reduce((sum, item) => sum + item.invoiceCount, 0)) * 100)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Sort data by invoice count descending
  const sortedData = [...data].sort((a, b) => b.invoiceCount - a.invoiceCount);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
        >
          <XAxis
            type="number"
            tick={{
              fill: isDark ? "#94A3B8" : "#64748B",
              fontSize: 12,
              fontWeight: 500,
            }}
            axisLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
            tickLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
          />
          
          <YAxis
            type="category"
            dataKey="vendor"
            tick={{
              fill: isDark ? "#E2E8F0" : "#1E293B",
              fontSize: 13,
              fontWeight: 500,
            }}
            axisLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
            tickLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
            width={120}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="invoiceCount"
            radius={[0, 6, 6, 0]}
            barSize={32}
            animationDuration={800}
            animationBegin={300}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                className="transition-opacity duration-200 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}