import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Calendar, Tag, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MentorQuickActionsProps {
  onOpenInterests: () => void;
}

export const MentorQuickActions: React.FC<MentorQuickActionsProps> = ({
  onOpenInterests,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/event-board")}
            >
              <Calendar className="h-6 w-6" />
              <span>Contenido del Semillero</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={onOpenInterests}
            >
              <Tag className="h-6 w-6" />
              <span>Gestionar Intereses</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/trusted-organizations")}
            >
              <Building2 className="h-6 w-6" />
              <span>Gestionar Organizaciones Confiables</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};