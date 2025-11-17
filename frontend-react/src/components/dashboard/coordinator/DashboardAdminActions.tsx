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
              <h4>Panel de Administración</h4>
              <p className="text-sm text-muted-foreground">
                Ver estadísticas detalladas y gestión
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/admin')}
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