import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  children?: React.ReactNode;
}

const CATEGORIES = [
  { value: "todos", label: "Todos" },
  { value: "evento", label: "Eventos" },
  { value: "articulo", label: "Artículos" },
  { value: "aviso", label: "Avisos" },
  { value: "comunicado", label: "Comunicados" },
  { value: "material", label: "Material" },
];

export const PublicationsCategoryTabs: React.FC<Props> = ({
  selectedCategory,
  onCategoryChange,
  children,
}) => {
  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-4 h-auto">
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedCategory} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
};
