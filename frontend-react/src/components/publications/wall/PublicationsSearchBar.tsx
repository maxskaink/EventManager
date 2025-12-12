import React from "react";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const PublicationsSearchBar: React.FC<Props> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar anuncios..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
