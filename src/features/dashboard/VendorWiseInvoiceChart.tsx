import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: {
    vendor: string;
    count: number;
  }[];
};

export default function VendorWiseInvoiceChart({
  data,
}: Props) {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="vendor" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="count" fill="#006DB0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}