import { Card, CardContent } from "../../ui/card";

interface StatisticCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  className?: string;
}

export const StatisticCard = ({ icon, value, label, className }: StatisticCardProps) => (
  <Card className={["rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg", className].filter(Boolean).join(" ") }>
    <CardContent className="p-4 text-center bg-slate-50 rounded-xl hover:bg-slate-100 transition">
      <div className="mx-auto mb-2 w-fit rounded-lg bg-gradient-to-br from-slate-200 to-slate-100 p-2 shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl tracking-tight">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);
