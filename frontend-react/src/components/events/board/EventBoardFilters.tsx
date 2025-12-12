import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Badge } from "../../ui/badge";

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
  const activeFiltersCount = [
    filterCategory !== "all",
    filterStatus !== "all",
  ].filter(Boolean).length;

  const FilterControls = () => (
    <>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Tipo de contenido</label>
          <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
            <SelectTrigger className="w-full">
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
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Estado</label>
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="w-full">
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
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Vista</label>
          <Select
            value={viewMode}
            onValueChange={(value: "grid" | "list") => onViewModeChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Cuadrícula</SelectItem>
              <SelectItem value="list">Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  return (
    <section>
      <Card>
        <CardContent className="p-3 sm:p-4">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contenido..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros
                  </span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh]">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                  <SheetDescription>
                    Personaliza la vista de tu contenido
                  </SheetDescription>
                </SheetHeader>
                
                <div className="p-4">
                  <FilterControls />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex flex-col lg:flex-row gap-4">
            {/* Search bar */}
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

            {/* Filter controls */}
            <div className="flex flex-wrap gap-2">
              <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
                <SelectTrigger className="w-full sm:w-40">
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
                <SelectTrigger className="w-full sm:w-40">
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
                <SelectTrigger className="w-full sm:w-32">
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