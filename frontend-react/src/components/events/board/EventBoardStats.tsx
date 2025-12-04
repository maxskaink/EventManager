import { Card, CardContent } from "../../ui/card";
import { Calendar, Users, Pin } from "lucide-react";

type Props = {
  loading: boolean;
  totalContent: number;
  totalEvents: number;
  totalPinned: number;
};

export function EventBoardStats({
  loading,
  totalContent,
  totalEvents,
  totalPinned,
}: Props) {
  const statValue = (value: number) => (loading ? "..." : value);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="rounded-2xl shadow-md border-0 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-blue-50 rounded-xl w-fit mx-auto mb-3">
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{statValue(totalContent)}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">Total Contenido</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md border-0 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-green-50 rounded-xl w-fit mx-auto mb-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{statValue(totalEvents)}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">Eventos</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md border-0 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-orange-50 rounded-xl w-fit mx-auto mb-3">
            <Pin className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{statValue(totalPinned)}</h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">Destacados</p>
        </CardContent>
      </Card>
    </section>
  );
}