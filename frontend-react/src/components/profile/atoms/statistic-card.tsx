import { Card, CardContent } from "../../ui/card";

interface StatisticCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  className?: string;
}

export const StatisticCard = ({ icon, value, label, className }: StatisticCardProps) => (
  <Card className={className}>
    <CardContent className="p-4 text-center">
      <div className="mx-auto mb-2 w-fit rounded-lg bg-primary/10 p-2">
        {icon}
      </div>
      <h3 className="text-2xl">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);
