import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Calendar, ClipboardList, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardContentManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="mb-4">Gestión de Contenido</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4>Contenido del Semillero</h4>
              <p className="text-sm text-muted-foreground">
                Gestionar eventos y publicaciones
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/event-board')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4>Reportes</h4>
              <p className="text-sm text-muted-foreground">
                Participación y logros
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/reports')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};