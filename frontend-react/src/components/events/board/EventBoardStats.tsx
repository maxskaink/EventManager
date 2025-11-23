import { Card, CardContent } from "../../ui/card";
import { Calendar, Users, Pin, Eye } from "lucide-react";

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
    <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl">{statValue(totalContent)}</h3>
          <p className="text-sm text-muted-foreground">Total Contenido</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl">{statValue(totalEvents)}</h3>
          <p className="text-sm text-muted-foreground">Eventos</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
            <Pin className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl">{statValue(totalPinned)}</h3>
          <p className="text-sm text-muted-foreground">Destacados</p>
        </CardContent>
      </Card>
    </section>
  );
}