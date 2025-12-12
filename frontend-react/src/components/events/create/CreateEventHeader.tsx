import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  loading: boolean;
}

//TODO: implement loading state

export const CreateEventHeader: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="bg-[#0a2740] p-4 shadow-sm text-white">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1>Crear Nuevo Evento</h1>
      </div>
    </div>
  );
};