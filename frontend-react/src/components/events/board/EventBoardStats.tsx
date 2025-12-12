import { Card, CardContent } from "../../ui/card";
import { Calendar, Users, Pin } from "lucide-react";

type Props = {
  loading: boolean;
  totalContent: number;
  totalEvents: number;
  totalPublications: number;
};

export function EventBoardStats({
  loading,
  totalContent,
  totalEvents,
  totalPublications,
}: Props) {
  const statValue = (value: number) => (loading ? "..." : value);

  return (
    <section className="grid grid-cols-3 gap-2 md:gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <Card className="rounded-xl md:rounded-2xl shadow-md border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-3 md:p-6 text-center">
          <div className="p-1.5 md:p-3 bg-blue-50 rounded-lg md:rounded-xl w-fit mx-auto mb-1.5 md:mb-3">
            <Calendar className="h-5 w-5 md:h-8 md:w-8 text-blue-600"/>
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-gray-800">{statValue(totalContent)}</h3>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium mt-0.5 md:mt-1">Total Contenido</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl md:rounded-2xl shadow-md border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-3 md:p-6 text-center">
          <div className="p-1.5 md:p-3 bg-green-50 rounded-lg md:rounded-xl w-fit mx-auto mb-1.5 md:mb-3">
            <Users className="h-5 w-5 md:h-8 md:w-8 text-green-600" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-gray-800">{statValue(totalEvents)}</h3>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium mt-0.5 md:mt-1">Eventos</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl md:rounded-2xl shadow-md border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-3 md:p-6 text-center">
          <div className="p-1.5 md:p-3 bg-orange-50 rounded-lg md:rounded-xl w-fit mx-auto mb-1.5 md:mb-3">
            <Pin className="h-5 w-5 md:h-8 md:w-8 text-purple-600" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-gray-800">{statValue(totalPublications)}</h3>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium mt-0.5 md:mt-1">Anuncios</p>
        </CardContent>
      </Card>
    </section>
  );
}