import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface PersonalInfoCardProps {
  user: API.User & { interests: API.Interest[] };
  role: string;
  getRoleLabel: (role: string) => string;
  allInterests?: API.Interest[];
  onAddInterest?: (id: number) => void;
  onDeleteInterest?: (id: number) => void;
}

export const PersonalInfoCard = ({
  user,
  role,
  getRoleLabel,
  allInterests = [],
  onAddInterest,
  onDeleteInterest
}: PersonalInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInterestId, setSelectedInterestId] = useState<string>("");

  const handleAddInterest = () => {
    if (selectedInterestId && onAddInterest) {
      onAddInterest(parseInt(selectedInterestId));
      setSelectedInterestId("");
    }
  };

  // Filter out interests the user already has
  const availableInterests = allInterests.filter(
    (interest) => !user.interests?.some((userInterest) => userInterest.id === interest.id)
  );

  return (
    <Card className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
          <Avatar className="h-20 w-20 sm:h-[100px] sm:w-[100px] rounded-full ring-2 ring-sky-600 shadow-md shrink-0">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback className="text-lg sm:text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="tracking-tight line-clamp-2">{user.name}</h2>
            <p className="text-muted-foreground text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap">{user.email}</p>
            <Badge className="mt-2 inline-block">{getRoleLabel(role)}</Badge>
          </div>
        </div>

        {role !== "guest" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Mis Intereses</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-full hover:bg-muted"
              >
                {isEditing ? "Listo" : "Editar"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest) => (
                  <Badge key={interest.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {interest.keyword}
                    {isEditing && onDeleteInterest && (
                      <button
                        onClick={() => onDeleteInterest(interest.id)}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm italic">No has definido intereses aún</p>
              )}
            </div>

            {isEditing && onAddInterest && (
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <Select value={selectedInterestId} onValueChange={setSelectedInterestId}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Seleccionar interés..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInterests.length > 0 ? (
                        availableInterests.map((interest) => (
                          <SelectItem key={interest.id} value={interest.id.toString()}>
                            {interest.keyword}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No hay más intereses disponibles
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button size="sm" onClick={handleAddInterest} disabled={!selectedInterestId}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
