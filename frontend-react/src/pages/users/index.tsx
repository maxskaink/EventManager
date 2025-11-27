import { useState } from "react";
import { useNavigate } from "react-router";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Search, User } from "lucide-react";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";

// Mock data for users
const MOCK_USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=alice" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Coordinator", avatar: "https://i.pravatar.cc/150?u=bob" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Mentor", avatar: "https://i.pravatar.cc/150?u=charlie" },
  { id: 4, name: "David Lee", email: "david@example.com", role: "Member", avatar: "https://i.pravatar.cc/150?u=david" },
  { id: 5, name: "Eva Green", email: "eva@example.com", role: "Interested", avatar: "https://i.pravatar.cc/150?u=eva" },
];

export const UserSearchScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = MOCK_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <UnifiedHeader title="Buscar Usuarios" />
      
      <div className="p-4 max-w-4xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/users/${user.id}`)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-base">{user.name}</CardTitle>
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
      </div>
    </div>
  );
};

export default UserSearchScreen;
