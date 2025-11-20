import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  backRoute: string;
}

export const EventsHeader: React.FC<Props> = ({ backRoute }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0a2740] p-4 shadow-sm text-white">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <button
          data-slot="button"
          type="button"
          onClick={() => navigate(backRoute)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-[20px] leading-9 font-semibold tracking-tight">Eventos</h1>
      </div>
    </div>
  );
};