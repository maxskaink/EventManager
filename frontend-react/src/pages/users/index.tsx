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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UnifiedHeader />
      <div className="container mx-auto px-4 py-8">
        <Card className="rounded-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Search Users</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading users...</p>}
            {isError && <p className="text-red-500">Error loading users</p>}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user: API.User) => (
                <Card
                  key={user.id}
                  className="cursor-pointer hover:shadow-md transition-shadow rounded-2xl"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar>
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSearchScreen;
