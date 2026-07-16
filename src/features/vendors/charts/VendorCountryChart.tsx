import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  data: {
    country: string;
    count: number;
  }[];
};

// Color palettes for different themes
const LIGHT_COLORS = [
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
  "#06B6D4", // cyan-500
  "#8B5CF6", // violet-500
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
  "#22D3EE", // cyan-400
  "#A78BFA", // violet-400
];

// Generate gradient stops for hover effect
const GRADIENTS = LIGHT_COLORS.map((color, index) => ({
  id: `gradient-${index}`,
  color,
  darkColor: DARK_COLORS[index] || color,
}));

export default function VendorCountryChart({
  data,
}: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  // Sort data by count descending
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  // Calculate total for percentage
  const total = sortedData.reduce((sum, item) => sum + item.count, 0);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / total) * 100).toFixed(1);
      
      return (
        <div className="rounded-xl border border-slate-200/60 bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: payload[0].payload.fill || payload[0].color }}
            />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {data.country}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Vendors:
            </span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {data.count}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Percentage:
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {percentage}%
            </span>
          </div>
          <div className="mt-1.5 h-px w-full bg-slate-200/60 dark:bg-slate-700/60" />
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {`${data.count} of ${total} total vendors`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        {payload.map((entry: any, index: number) => {
          const percentage = ((entry.payload.count / total) * 100).toFixed(1);
          return (
            <div 
              key={`legend-${index}`}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ 
                cursor: 'pointer',
                opacity: activeIndex === null || activeIndex === index ? 1 : 0.5
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div 
                className="h-2.5 w-2.5 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-600 dark:text-slate-300">
                {entry.value}
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200/60 bg-slate-50/30 dark:border-slate-700/60 dark:bg-slate-800/20">
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No country data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <PieChart>
          <defs>
            {GRADIENTS.map((grad, index) => (
              <linearGradient key={grad.id} id={grad.id} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isDark ? grad.darkColor : grad.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={isDark ? grad.darkColor : grad.color} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>

          <Pie
            data={sortedData}
            dataKey="count"
            nameKey="country"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={130}
            paddingAngle={3}
            animationDuration={800}
            animationBegin={300}
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              const percentage = ((value / total) * 100).toFixed(1);
              
              // Only show label if percentage is significant
              if (parseFloat(percentage) < 3) return null;
              
              return (
                <text
                  x={x}
                  y={y}
                  fill={isDark ? "#94A3B8" : "#475569"}
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={11}
                  fontWeight={500}
                >
                  {percentage}%
                </text>
              );
            }}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${index % GRADIENTS.length})`}
                stroke={isDark ? "#1E293B" : "#FFFFFF"}
                strokeWidth={2}
                className="transition-all duration-200 cursor-pointer hover:opacity-80"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  filter: activeIndex === null || activeIndex === index 
                    ? 'none' 
                    : 'blur(1px) brightness(0.8)',
                  transition: 'filter 0.3s ease',
                }}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />

          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={60}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}