import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import { getDashboardRouteFromRole } from "../services/navigation/redirects";
import BottomNavbarWrapper from "../components/nav/BottomNavbarWrapper";

import { PublicationList, PublicationLoading, PublicationEmpty } from "../components/publications";
import { PublicationsCategoryTabs } from "../components/publications/wall/PublicationsCategoryTabs";
import { PublicationsSearchBar } from "../components/publications/wall/PublicationsSearchBar";
import { publicationQueries, eventQueries } from "@/services/react-query/queries";
import type { ContentItem } from "@/features/events/types";

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

  // 2. Fetch Events (For enrichment only)
  const { data: events = [] } = useQuery(eventQueries.all());

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
    if (!publications) return [];
    
    // Helper to find event
    const findEvent = (eventId: number | null) => {
      if (!eventId) return null;
      return events.find(e => e.id === eventId);
    };

    return publications.map(pub => {
      const associatedEvent = findEvent(pub.event_id);
      
      // Base item
      const item: ContentItem = {
        id: `pub-${pub.id}`,
        type: pub.type,
        title: pub.title,
        description: pub.summary || pub.content || "",
        date: pub.published_at ? pub.published_at.split("T")[0] : pub.created_at.split("T")[0],
        status: pub.status,
        kind: 'publication',
        original: pub, // Store original publication
      };

      // Enrichment if event exists
      if (associatedEvent) {
        item.subtype = associatedEvent.event_type;
        item.date = associatedEvent.start_date.split("T")[0]; // Use event date
        item.time = associatedEvent.start_date.split("T")[1]?.substring(0, 5);
        item.location = associatedEvent.location || associatedEvent.modality;
        item.capacity = associatedEvent.capacity || 0;
        item.eventId = associatedEvent.id.toString();
        
        // If the publication doesn't have an image but the event might (logic placeholder)
        // We handle image fallback in the Card component using 'original'
        
        // Store event in original as well if needed, or just rely on the fact that we have pub.event_id
        // Actually, let's attach the event object to the publication object in 'original' 
        // effectively merging them for the card to use
        item.original = { ...pub, ...associatedEvent, image_url: pub.image_url }; 
      }

      return item;
    });
  }, [publications, events]);

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
      <div className="bg-[#0a2740] p-4 shadow-sm text-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(dashboardRoute)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium hover:bg-white/10 size-9 rounded-md text-white transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">Publicaciones</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <PublicationsSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        
        <PublicationsCategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory}>
           {renderContent()}
        </PublicationsCategoryTabs>
      </div>

      <BottomNavbarWrapper role={role} />
    </div>
  );
}
