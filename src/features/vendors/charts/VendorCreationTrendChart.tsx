import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  data: {
    month: string;
    count: number;
  }[];
};

export default function VendorCreationTrendChart({
  data,
}: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  // Calculate trend indicators
  const getTrend = () => {
    if (data.length < 2) return { direction: 'stable', change: 0 };
    const last = data[data.length - 1].count;
    const first = data[0].count;
    const change = ((last - first) / first * 100);
    return {
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      change: Math.abs(change).toFixed(1)
    };
  };

  const trend = getTrend();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200/60 bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/90">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              New Vendors:
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {payload[0].value}
            </span>
          </div>
          {data.length > 1 && (
            <div className="mt-1.5 h-px w-full bg-slate-200/60 dark:bg-slate-700/60" />
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex items-center justify-center gap-4 pt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-1.5">
            <div 
              className="h-2.5 w-2.5 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/60 bg-slate-50/30 dark:border-slate-700/60 dark:bg-slate-800/20">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No trend data available
        </p>
      </div>
    );
  }

  // Calculate max value for Y axis domain
  const maxValue = Math.max(...data.map(d => d.count));
  const yAxisDomain = [0, Math.ceil(maxValue * 1.2)];

  return (
    <div className="space-y-3">
      {/* Header with Trend Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {data[data.length - 1]?.count || 0}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            vendors this month
          </span>
        </div>
        <div className="flex items-center gap-2">
          {trend.direction !== 'stable' && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
              trend.direction === 'up' 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.change}%
            </span>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500">
            vs previous
          </span>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer>
          <LineChart 
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCountDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? "#334155" : "#E2E8F0"}
              strokeOpacity={0.5}
            />

            <XAxis 
              dataKey="month" 
              tick={{
                fill: isDark ? "#94A3B8" : "#64748B",
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
              tickLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />

            <YAxis 
              tick={{
                fill: isDark ? "#94A3B8" : "#64748B",
                fontSize: 11,
                fontWeight: 500,
              }}
              axisLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
              tickLine={{ stroke: isDark ? "#334155" : "#E2E8F0" }}
              domain={yAxisDomain}
              tickCount={6}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom"
              height={36}
            />

            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill="url(#colorCount)"
              fillOpacity={1}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke={isDark ? "#60A5FA" : "#3B82F6"}
              strokeWidth={3}
              dot={{
                fill: isDark ? "#60A5FA" : "#3B82F6",
                stroke: isDark ? "#1E293B" : "#FFFFFF",
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{
                fill: isDark ? "#60A5FA" : "#3B82F6",
                stroke: isDark ? "#1E293B" : "#FFFFFF",
                strokeWidth: 2,
                r: 7,
              }}
              animationDuration={1000}
              animationBegin={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}