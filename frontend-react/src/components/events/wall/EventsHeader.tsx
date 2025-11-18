import React from 'react';
import { Button } from '../../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  backRoute: string;
}

export const EventsHeader: React.FC<Props> = ({ backRoute }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(backRoute)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1>Eventos</h1>
      </div>
    </div>
  );
};