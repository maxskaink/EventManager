import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Textarea } from "../../ui/textarea";
 
import { useAuthStore } from "../../../stores/auth.store";

// Asumiendo que 'user' y 'role' vienen de un store o context
interface PersonalInfoCardProps {
  user: API.User & { interests: Array<string>};
  role: string;
  getRoleLabel: (role: string) => string;
}

export const PersonalInfoCard = ({ user, role, getRoleLabel }: PersonalInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [interests, setInterests] = useState(user.interests?.join(", ") || "");
  const setUser = useAuthStore((s) => s.setUser);

  const handleSaveInterests = () => {
    const parsed = interests
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Actualiza el usuario en el store para que persista y refresque la UI
    setUser({ ...user, interests: parsed } as API.User);
    setIsEditing(false);
  };

  return (
    <Card className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-6">
          <Avatar className="h-[100px] w-[100px] rounded-full ring-2 ring-sky-600 shadow-md">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="tracking-tight">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge className="mt-2">{getRoleLabel(role)}</Badge>
          </div>
          {/* Botón duplicado de editar removido por no tener acción y existir el de 'Mis Intereses' */}
        </div>

        {role !== "guest" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Mis Intereses</label>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
              >
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
                <Button onClick={handleSaveInterests} className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95">
                  Guardar cambios
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">{(user.interests && user.interests.length>0 ? user.interests.join(", ") : "No has definido intereses aún")}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
