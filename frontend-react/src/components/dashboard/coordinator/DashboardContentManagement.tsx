import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardContentManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Gestión de Contenido</h2>
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="bg-white border border-slate-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 mb-1">Contenido del Semillero</h4>
              <p className="text-sm text-slate-600">
                Gestionar eventos y anuncios
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/publications')}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};