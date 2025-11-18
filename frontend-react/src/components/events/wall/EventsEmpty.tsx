import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Calendar } from 'lucide-react';

export const EventsEmpty: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardContent className="p-8 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          No se encontraron eventos con los filtros seleccionados.
        </p>
      </CardContent>
    </Card>
  );
};