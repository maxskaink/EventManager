import { Award, BookOpen, Calendar } from "lucide-react";
import { StatisticCard } from "../atoms/statistic-card";

interface ParticipationStatsProps {
  eventsCount: number;
  certificatesCount: number;
  articlesCount: number;
}

export const ParticipationStats = ({ eventsCount, certificatesCount, articlesCount }: ParticipationStatsProps) => (
  <section>
    <h2 className="mb-4">Mi Participación</h2>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <StatisticCard
        icon={<Calendar className="h-6 w-6 text-blue-600" />}
        value={eventsCount}
        label="Eventos Registrados"
      />
      <StatisticCard
        icon={<Award className="h-6 w-6 text-green-600" />}
        value={certificatesCount}
        label="Certificados"
      />
      <StatisticCard
        icon={<BookOpen className="h-6 w-6 text-purple-600" />}
        value={articlesCount}
        label="Artículos Escritos"
        className="col-span-2 md:col-span-1"
      />
    </div>
  </section>
);
