import React from 'react';
import { Card, CardContent } from '../ui/card';
import { FileText } from 'lucide-react';

export const PublicationEmpty: React.FC = () => {
  return (
    <Card className="mt-6">
      <CardContent className="p-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold">No hay anuncios</h3>
        <p className="text-muted-foreground">
          Aún no se ha publicado ningún contenido.
        </p>
      </CardContent>
    </Card>
  );
};