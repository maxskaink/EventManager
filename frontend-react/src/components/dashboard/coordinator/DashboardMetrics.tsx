import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Users, Calendar, TrendingUp } from 'lucide-react';

interface DashboardMetricsProps {
  totalEvents: number;
  totalEnrolled: number;
  averageParticipation: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalEvents,
  totalEnrolled,
  averageParticipation,
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl">{totalEvents}</h3>
          <p className="text-sm text-muted-foreground">Eventos Totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl">{totalEnrolled}</h3>
          <p className="text-sm text-muted-foreground">Total Inscritos</p>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-1">
        <CardContent className="p-4 text-center">
          <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl">{averageParticipation}%</h3>
          <p className="text-sm text-muted-foreground">Participación Promedio</p>
        </CardContent>
      </Card>
    </section>
  );
};