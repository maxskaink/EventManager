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
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border border-slate-200">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl w-fit mx-auto mb-3 shadow-sm">
            <Calendar className="h-7 w-7 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalEvents}</h3>
          <p className="text-sm text-slate-600 font-medium">Eventos Totales</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border border-slate-200">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl w-fit mx-auto mb-3 shadow-sm">
            <Users className="h-7 w-7 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{totalEnrolled}</h3>
          <p className="text-sm text-slate-600 font-medium">Total Inscritos</p>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border border-slate-200">
        <CardContent className="p-6 text-center">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl w-fit mx-auto mb-3 shadow-sm">
            <TrendingUp className="h-7 w-7 text-purple-600" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">{averageParticipation}%</h3>
          <p className="text-sm text-slate-600 font-medium">Participación Promedio</p>
        </CardContent>
      </Card>
    </section>
  );
};