import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { BarChart, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardAdminActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="mb-4">Administración</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
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

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4>Exportar Datos</h4>
              <p className="text-sm text-muted-foreground">
                Generar reportes en Excel o PDF
              </p>
            </div>
            <Button size="sm" variant="outline">
              Generar
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};