import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const PublicationLoading: React.FC = () => {
  // Genera Skeletons con alturas variables para simular el layout masonry
  const heights = ['h-64', 'h-80', 'h-56', 'h-72', 'h-64', 'h-80'];

  return (
    <div className="md:column-count-3 lg:column-count-4 column-count-2 gap-4">
      {heights.map((height, index) => (
        <Card key={index} className="mb-4 break-inside-avoid">
          <Skeleton className={`w-full ${height} rounded-t-lg`} />
          <CardContent className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};