import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardRouteFromRole } from "../services/navigation/redirects";
import BottomNavbarWrapper from "../components/nav/BottomNavbarWrapper";

import { PublicationList, PublicationLoading, PublicationEmpty } from "../components/publications";
import { PublicationsCategoryTabs } from "../components/publications/wall/PublicationsCategoryTabs";
import { PublicationsSearchBar } from "../components/publications/wall/PublicationsSearchBar";
import { publicationQueries } from "@/services/react-query/queries";
import type { ContentItem } from "@/features/events/types";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";
import { publicationToContentItem } from "@/features/events";

/**
 * This publications screen lists all the PUBLIC publciations
 * please don't list any events here, it will break the application
 */
export function PublicationsScreen() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "";
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Queries
  // 1. Fetch Publications (Source of Truth)
  const { data: publications = [], isLoading: isLoadingPubs, isError: isErrorPubs } = useQuery(
    role === "mentor" || role === "coordinator" ?
      publicationQueries.all() : publicationQueries.published()
  );

  const isLoading = isLoadingPubs;
  const isError = isErrorPubs;

  const normalizedRole = useMemo(() => {
    if (role === "active-member" || role === "seed") {
      return "member";
    }
    return role;
  }, [role]);

  const dashboardRoute = useMemo(() => getDashboardRouteFromRole(normalizedRole), [normalizedRole]);

  // Data Transformation & Enrichment
  const contentItems: ContentItem[] = useMemo(() => {
    return publications?.map(publicationToContentItem) ?? [];
  }, [publications]);

  // Filtering
  const filteredItems = useMemo(() => {
    return contentItems.filter(item => {
      // Search
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const matchesCategory = selectedCategory === "todos" || item.type === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contentItems, searchTerm, selectedCategory]);


  const renderContent = () => {
    if (isLoading) {
      return <PublicationLoading />;
    }

    if (isError) {
      return <p className="text-center text-destructive">Error al cargar las publicaciones.</p>;
    }

    if (filteredItems.length === 0) {
      return <PublicationEmpty />;
    }

    return <PublicationList publications={filteredItems} />;
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <UnifiedHeader
          title="Publicaciones"
          onGoBack={() => navigate(dashboardRoute)}
        />
      </div>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <PublicationsSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <PublicationsCategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}>
          {renderContent()}
        </PublicationsCategoryTabs>
      </div>

      <BottomNavbarWrapper role={role} />
    </div>
  );
}
