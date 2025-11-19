import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft, Eye, Save } from 'lucide-react';

interface Props {
  onBack: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  loading: boolean;
}

export const CreateEventHeader: React.FC<Props> = ({
  onBack,
  onPreview,
  onSaveDraft,
  loading,
}) => {
  return (
    <div className="bg-[#0a2740] p-4 shadow-sm text-white">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1>Crear Nuevo Evento</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </Button>
          <Button
            variant="secondary"
            onClick={onSaveDraft}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};