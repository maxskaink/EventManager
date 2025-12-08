import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardRouteFromRole } from "../services/navigation/redirects";
import BottomNavbarWrapper from "../components/nav/BottomNavbarWrapper";

import { PublicationList, PublicationLoading, PublicationEmpty } from "../components/publications";
import { PublicationsCategoryTabs } from "../components/publications/wall/PublicationsCategoryTabs";
import { PublicationsSearchBar } from "../components/publications/wall/PublicationsSearchBar";
import { publicationQueries } from "@/services/react-query/queries";
import type { ContentItem } from "@/features/events/types";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";
import { publicationToContentItem } from "@/features/events/publication.helpers";
import { HideOnScrollWrapper } from "@/components/layout/HideOnScrollWrapper";
import { PublicationsDateFilter } from "@/components/publications/wall/PublicationsDateFilter";
import type { DateRange } from "react-day-picker";
import { InfiniteScrollTrigger } from "@/components/common/InfiniteScrollTrigger";

/**
 * This publications screen lists all the PUBLIC publications
 * please don't list any events here, it will break the application
 */
export function PublicationsScreen() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Build filter object for server-side filtering
  const filters = useMemo(() => {
    const baseFilters: Partial<PublicationAPI.ListPublicationsFilters> = {};
    
    if (searchTerm) {
      baseFilters.search = searchTerm;
    }
    
    if (selectedCategory !== "todos") {
      baseFilters.type = selectedCategory as API.PublicationType;
    }
    
    if (dateRange?.from) {
      baseFilters.date_from = dateRange.from.toISOString().split('T')[0];
    }
    
    if (dateRange?.to) {
      baseFilters.date_to = dateRange.to.toISOString().split('T')[0];
    }
    
    // Add status filter based on role
    if (role !== "mentor" && role !== "coordinator") {
      baseFilters.status = 'activo';
    }
    
    return baseFilters;
  }, [searchTerm, selectedCategory, dateRange, role]);

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(publicationQueries.infinite(filters));

  const normalizedRole = useMemo(() => {
    if (role === "active-member" || role === "seed") {
      return "member";
    }
    return role;
  }, [role]);

  const dashboardRoute = useMemo(() => getDashboardRouteFromRole(normalizedRole), [normalizedRole]);

  // Flatten pages into single array
  const publications = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  // Transform to content items
  const contentItems: ContentItem[] = useMemo(() => {
    return publications.map(publicationToContentItem);
  }, [publications]);

  // Sort by date (server already filters, we just sort)
  const sortedItems = useMemo(() => {
    return [...contentItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contentItems]);

  const renderContent = () => {
    if (isLoading) {
      return <PublicationLoading />;
    }

    if (isError) {
      return <p className="text-center text-destructive">Error al cargar las publicaciones.</p>;
    }

    if (sortedItems.length === 0) {
      return <PublicationEmpty />;
    }

    return (
      <>
        <PublicationList publications={sortedItems} />
        <InfiniteScrollTrigger
          onIntersect={() => fetchNextPage()}
          hasMore={hasNextPage ?? false}
          isFetching={isFetchingNextPage}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      <HideOnScrollWrapper>
        <UnifiedHeader
          title="Publicaciones"
          onGoBack={() => navigate(dashboardRoute)}
        />
      </HideOnScrollWrapper>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <PublicationsSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <PublicationsDateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>

        <PublicationsCategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}>
          {renderContent()}
        </PublicationsCategoryTabs>
      </div>

      <BottomNavbarWrapper role={role} />
    </div>
  );
}
