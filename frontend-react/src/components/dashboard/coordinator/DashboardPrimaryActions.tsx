import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Plus, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importar desde react-router-dom

export const DashboardPrimaryActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="mb-4">Acciones Principales</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Crear evento */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-dashed">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-primary rounded-lg w-fit mx-auto mb-3">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
            <h4>Crear Evento</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Organiza charlas, cursos y convocatorias
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/create-event')}
            >
              Crear Evento
            </Button>
          </CardContent>
        </Card>

        {/* Crear publicación */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-dashed">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-green-600 rounded-lg w-fit mx-auto mb-3">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <h4>Nueva Publicación</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Redacta comunicados y artículos
            </p>
            <Button
              className="w-full"
              onClick={() => navigate('/create-publication')}
            >
              Crear Publicación
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};