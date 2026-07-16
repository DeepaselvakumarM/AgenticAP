import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: number;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <Card className="border-primary/10 bg-gradient-to-br from-white to-primary/5 dark:from-card dark:to-primary/10">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold text-primary">
          {value}
        </h2>
      </CardContent>
    </Card>
  );
}