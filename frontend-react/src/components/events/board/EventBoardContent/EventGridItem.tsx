import { Calendar, MapPin, MoreVertical, Eye, Trash2, Users, Edit, Share2, Users2, Pin, Share } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import {
  getOccupancyLevel,
  getStatusColor,
  getStatusLabel,
  getTypeColor,
} from "../../../../features/events/event-board.helpers";
import { Badge } from "../../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import type { ContentItem, ItemToDelete } from "../../../../features/events";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";

interface EventGridItemProps {
  item: ContentItem;
  isPinned: boolean;
  onViewDetails: (item: ContentItem) => void;
  onDeleteClick: (item: ItemToDelete) => void;
  onPublish: (item: ContentItem) => void;
  onAttendance: (item: ContentItem) => void;
  onEditEvent: (item: ContentItem) => void;
  onEditPublication: (item: ContentItem) => void;
  onSharePublication: (item: ContentItem) => void;
}

const EventGridItem = ({
  item,
  isPinned,
  onViewDetails,
  onDeleteClick,
  onPublish,
  onAttendance,
  onEditEvent,
  onEditPublication,
  onSharePublication,
}: EventGridItemProps) => {
  const isEvent = item.kind === 'event';
  const occupancy = isEvent && item.capacity && item.enrolled ? getOccupancyLevel(item.enrolled, item.capacity) : null;

  const eventDate = new Date(item.date);
  const currentDate = new Date();

  // Check if event has ended
  const hasEnded = isEvent && (eventDate < currentDate);

  // Check if event has publication OR if publication has event
  const hasPublication = item.original?.publication_id !== null && item.original?.publication_id !== undefined;
  const hasEvent = item.original?.event !== null && item.original?.event !== undefined;

  // Helper to determine if we show "Editar Anuncio"
  const showEditPublication = !isEvent || (isEvent && hasPublication);

  return (
    <Card className={`transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group ${isPinned ? "border-blue-500 border-2" : "border border-slate-200"}`}>
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="p-5 relative z-10">
        {/* Header: Badges y Menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            <Badge className={`text-xs font-medium ${getTypeColor(item.type)}`}>{item.type}</Badge>
            <Badge className={`text-xs font-medium ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</Badge>
          </div>
          <div className="flex items-center gap-1 transition-opacity duration-200">
            {isPinned && <Pin className="h-4 w-4 text-blue-500" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="hover:bg-slate-100 h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(item)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </DropdownMenuItem>
                {isEvent && (
                  <>
                    <DropdownMenuItem onClick={() => onAttendance(item)} className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        Ver asistentes
                    </DropdownMenuItem>
                  </>
                )}
                {/* Show event edit if it's an event OR if it's a publication with an event */}
                {(isEvent || hasEvent) && (
                  <DropdownMenuItem onClick={() => onEditEvent(item)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Evento
                  </DropdownMenuItem>
                )}
                {/* Show publication edit if it's a publication OR if it's an event with publication */}
                {showEditPublication && (
                  <DropdownMenuItem onClick={() => onEditPublication(item)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Anuncio
                  </DropdownMenuItem>
                )}
                {/* Share Option - Only for draft publications */}
                {item.kind === "publication" && (
                  <DropdownMenuItem onClick={() => onSharePublication(item)} className="cursor-pointer">
                    <Share2 className="h-4 w-4 mr-2" /> Compartir Acceso
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() =>
                    onDeleteClick({
                      id: item.id,
                      type: item.type,
                      title: item.title,
                    })
                  }
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <h4 className="line-clamp-2 font-semibold text-[#0a2740] mb-2 group-hover:text-blue-700 transition-colors">{item.title}</h4>
        
        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 group-hover:text-slate-700 transition-colors">{item.description}</p>
        
        {/* Meta Info */}
        <div className="space-y-2 text-xs text-slate-500 mb-4">
          {occupancy && (
            <div className="flex items-center gap-2">
              <Users2 className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-medium">{occupancy.label}</span>
            </div>
          )}
          {isEvent && item.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
            </div>
          )}
          {isEvent && item.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-orange-600" />
              <span className="truncate">{item.location}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs sm:text-sm h-8 transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
            onClick={() => onViewDetails(item)}
          >
            <Eye className="h-3.5 w-3.5 mr-1 shrink-0" />
            <span>Ver</span>
          </Button>
          {/* Solo mostrar botón "Publicar" si es un evento */}
          {isEvent && hasEnded && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs sm:text-sm h-8 px-2 transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
              onClick={() => onAttendance(item)}
            >
              <Users className="h-3.5 w-3.5 shrink-0"/>
            </Button>
          )}
          {isEvent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs sm:text-sm h-8 px-2 transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => onPublish(item)}
                  >
                    <Share className="h-3.5 w-3.5 shrink-0" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  <p>Publicar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventGridItem;
