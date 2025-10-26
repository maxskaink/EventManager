import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";

interface ProfileHeaderProps {
  backViewUrl: string;
}

export const ProfileHeader = ({ backViewUrl }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-primary p-4 text-primary-foreground">
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(backViewUrl)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1>Mi Perfil</h1>
      </div>
    </div>
  );
};
