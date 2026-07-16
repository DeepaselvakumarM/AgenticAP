import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    date: string;
    minutes: number;
  }[];
};

export default function AverageProcessingTimeChart({
  data,
}: Props) {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="minutes"
            stroke="#006DB0"
            fill="#7cc0e0"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}