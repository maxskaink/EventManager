import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { BarChart, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardAdminActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Administración</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">Panel de Administración y Eventos</h4>
              <p className="text-sm text-slate-600">
                Ver estadísticas detalladas y gestión
              </p>
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => navigate('/event-board')}
            >
              Abrir
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">Exportar Datos</h4>
              <p className="text-sm text-slate-600">
                Generar reportes en Excel o PDF
              </p>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              Generar
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};