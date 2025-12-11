import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Plus, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Importar desde react-router-dom

export const DashboardPrimaryActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Acciones Principales</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Crear evento */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl w-fit mx-auto mb-4 shadow-md">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Crear Evento</h4>
            <p className="text-sm text-slate-600 mb-4">
              Organiza charlas, cursos y convocatorias
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => navigate('/create-event')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Evento
            </Button>
          </CardContent>
        </Card>

        {/* Crear anuncio */}
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl w-fit mx-auto mb-4 shadow-md">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Nueva Anuncio</h4>
            <p className="text-sm text-slate-600 mb-4">
              Redacta comunicados y artículos
            </p>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => navigate('/create-publication')}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Crear Anuncio
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};