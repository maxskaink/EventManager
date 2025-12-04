import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Search, User } from "lucide-react";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";
import userAPI from "../../services/api/endpoints/user";

export const UserSearchScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ['activeUsers'],
    queryFn: userAPI.listActiveUsers,
  });

  const users = usersResponse || [];

  const filteredUsers = users.filter((user: API.User) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <UnifiedHeader title="Buscar Usuarios" showAvatar={false} />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-full shadow-sm border-gray-200 focus-visible:ring-primary"
          />
        </div>

        {isLoading && <div className="text-center py-8">Cargando usuarios...</div>}

        {isError && <div className="text-center py-8 text-red-500">Error al cargar usuarios</div>}

        {!isLoading && !isError && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredUsers.map((user: API.User) => (
              <Card
                key={user.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl border-0 shadow-md bg-white group hover:-translate-y-1"
                onClick={() => navigate(`/users/${user.id}`)}
              >
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar>
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-base font-bold text-gray-800 group-hover:text-primary transition-colors">{user.name}</CardTitle>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </CardContent>
              </Card>
            ))}

            {filteredUsers.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No se encontraron usuarios.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearchScreen;
