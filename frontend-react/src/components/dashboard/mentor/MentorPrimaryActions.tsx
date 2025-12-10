import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Plus, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MentorPrimaryActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Principales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => navigate('/create-event')}
          >
            <Plus className="h-6 w-6 text-blue-500" />
            <span>Crear Evento</span>
            <span className="text-xs text-muted-foreground font-normal">Organiza charlas y cursos</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => navigate('/create-publication')}
          >
            <Edit3 className="h-6 w-6 text-emerald-500" />
            <span>Nueva Publicación</span>
            <span className="text-xs text-muted-foreground font-normal">Redacta comunicados</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
