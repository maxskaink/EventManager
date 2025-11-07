import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Textarea } from "../../ui/textarea";
import { Edit } from "lucide-react";

// Asumiendo que 'user' y 'role' vienen de un store o context
interface PersonalInfoCardProps {
  user: API.User & { interests: Array<string>};
  role: string;
  getRoleLabel: (role: string) => string;
}

export const PersonalInfoCard = ({ user, role, getRoleLabel }: PersonalInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [interests, setInterests] = useState(user.interests?.join(", ") || "");

  const handleSaveInterests = () => {
    // Lógica para guardar
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2>{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge className="mt-2">{getRoleLabel(role)}</Badge>
          </div>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        {role !== "guest" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label>Mis Intereses</label>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Machine Learning, React, Python..."
                  rows={3}
                />
                <Button onClick={handleSaveInterests}>Guardar cambios</Button>
              </div>
            ) : (
              <p className="text-muted-foreground">{user.interests?.join(", ") || "No has definido intereses aún"}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
