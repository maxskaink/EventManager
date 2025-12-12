import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { EVENT_TYPES, translateEventType } from '../../../features/events';

interface Props {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  children?: React.ReactNode;
}

const CATEGORIES = [
  { value: "todos", label: "Todos" },
  ...EVENT_TYPES.map((cat) => ({ value: cat, label: translateEventType(cat) })),
];

export const EventsCategoryTabs: React.FC<Props> = ({
  selectedCategory,
  onCategoryChange,
  children,
}) => {
  return (
    <Tabs value={selectedCategory} onValueChange={onCategoryChange}>
      <TabsList className={`grid w-full grid-cols-${EVENT_TYPES.length}`}>
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value}>
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedCategory}>{children}</TabsContent>
    </Tabs>
  );
};