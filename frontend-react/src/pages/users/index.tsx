import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Search, User } from "lucide-react";
import { UnifiedHeader } from "../../components/layout/UnifiedHeader";
import { HideOnScrollWrapper } from "../../components/layout/HideOnScrollWrapper";
import { InfiniteScrollTrigger } from "../../components/common/InfiniteScrollTrigger";
import { userQueries } from "../../services/react-query/queries";
import { translateUserRole } from "@/features/users/users.helpers";

export const UserSearchScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Build filter object for server-side filtering
  const filters = useMemo(() => {
    const baseFilters: Partial<UserAPI.ListUsersFilters> = {
      status: 'active', // Only show active users
    };
    
    if (searchTerm) {
      baseFilters.search = searchTerm;
    }
    
    return baseFilters;
  }, [searchTerm]);

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(userQueries.infinite(filters));

  // Flatten pages into single array
  const users = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <HideOnScrollWrapper>
        <UnifiedHeader title="Buscar Usuarios" showAvatar={false} />
      </HideOnScrollWrapper>

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
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {users.map((user: API.User) => (
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
                      <span className="text-xs text-muted-foreground">{translateUserRole(user.role)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </CardContent>
                </Card>
              ))}

              {users.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No se encontraron usuarios.
                </div>
              )}
            </div>
            
            <InfiniteScrollTrigger
              onIntersect={() => fetchNextPage()}
              hasMore={hasNextPage ?? false}
              isFetching={isFetchingNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserSearchScreen;
