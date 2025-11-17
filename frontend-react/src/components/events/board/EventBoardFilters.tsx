import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Search } from "lucide-react";

type Props = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (value: "grid" | "list") => void;
};

export function EventBoardFilters({
  searchQuery,
  onSearchQueryChange,
  filterCategory,
  onFilterCategoryChange,
  filterStatus,
  onFilterStatusChange,
  viewMode,
  onViewModeChange,
}: Props) {
  return (
    <section>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contenido..."
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="charla">Charlas</SelectItem>
                  <SelectItem value="curso">Cursos</SelectItem>
                  <SelectItem value="convocatoria">Convocatorias</SelectItem>
                  <SelectItem value="comunicado">Comunicados</SelectItem>
                  <SelectItem value="articulo">Artículos</SelectItem>
                  <SelectItem value="anuncio">Anuncios</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={onFilterStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="upcoming">Próximos</SelectItem>
                  <SelectItem value="ongoing">En curso</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={viewMode}
                onValueChange={(value: "grid" | "list") => onViewModeChange(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Cuadrícula</SelectItem>
                  <SelectItem value="list">Lista</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}