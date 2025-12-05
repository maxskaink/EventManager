import { cn } from "@/components/ui/utils";
import { Card, CardContent } from "../../ui/card";

interface StatisticCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  className?: string;
}

export const StatisticCard = ({ icon, value, label, className }: StatisticCardProps) => (
  <Card className={cn(className, "bg-slate-50 hover:bg-slate-100")}>
    <CardContent className="p-4 text-center transition">
      <div className="mx-auto mb-2 w-fit rounded-lg bg-linear-to-br from-slate-200 to-slate-100 p-2 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl tracking-tight">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);
