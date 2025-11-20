import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  backViewUrl: string;
  title?: string;
}

export const ProfileHeader = ({ backViewUrl, title = "Mi Perfil" }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="bg-[#0a2740] p-4 text-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(backViewUrl)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-transform duration-200 hover:-translate-y-1 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
    </header>
  );
};
