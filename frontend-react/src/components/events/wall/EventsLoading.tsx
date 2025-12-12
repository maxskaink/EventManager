import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton'; // Asumiendo que tienes Skeleton

export const EventsLoading: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="aspect-video w-full rounded-t-lg" />
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};