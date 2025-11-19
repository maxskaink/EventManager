import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";

interface ProfileHeaderProps {
  backViewUrl: string;
}

export const ProfileHeader = ({ backViewUrl }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0a2740] p-4 shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-center relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(backViewUrl)}
          className="absolute left-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-white font-semibold text-lg tracking-tight">Mi Perfil</h1>
      </div>
    </div>
  );
};
