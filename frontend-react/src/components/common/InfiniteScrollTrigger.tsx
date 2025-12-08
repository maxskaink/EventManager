import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  hasMore: boolean;
  isFetching: boolean;
}

export const InfiniteScrollTrigger = ({
  onIntersect,
  hasMore,
  isFetching,
}: InfiniteScrollTriggerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, hasMore, isFetching]);

  if (!hasMore) {
    return null;
  }

  return (
    <div ref={ref} className="h-20 flex items-center justify-center py-8">
      {isFetching && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Cargando más...</span>
        </div>
      )}
    </div>
  );
};
