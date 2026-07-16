import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: {
    status: string;
    count: number;
  }[];
};

export default function InvoiceStatusChart({
  data,
}: Props) {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
          >
            <Cell fill="#006DB0" />
            <Cell fill="#3f9bcf" />
            <Cell fill="#7cc0e0" />
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}