import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";

import { Trash2, Eye, Pin, Share, Users, MoreVertical, Calendar, MapPin, Users2, Edit2 } from "lucide-react";
import {
  getTypeColor,
  getStatusColor,
  getStatusLabel,
  getOccupancyLevel,
  isEventType,
} from "../../../../features/events/event-board.helpers";
import type { ContentItem, ItemToDelete } from "../../../../features/events";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../ui/tooltip";

// Componente Interno: List Item
const EventListItem = ({
  item,
  isPinned,
  onViewDetails,
  onDeleteClick,
  onPublish,
  onAttendance,
  onEditEvent,
  onEditPublication,
}: {
  item: ContentItem;
  isPinned: boolean;
  onViewDetails: (item: ContentItem) => void;
  onDeleteClick: (item: ItemToDelete) => void;
  onPublish: (item: ContentItem) => void;
  onAttendance: (item: ContentItem) => void;
  onEditEvent: (item: ContentItem) => void;
  onEditPublication: (item: ContentItem) => void;
}) => {
  const isEventT = isEventType(item.type);
  const occupancy = isEventT && item.capacity && item.enrolled ? getOccupancyLevel(item.enrolled, item.capacity) : null;
  const hasEnded = isEventT && new Date(item.date) < new Date();
  
  // Check if event has publication OR if publication has event
  const hasPublication = item.original?.publication_id !== null && item.original?.publication_id !== undefined;
  const hasEvent = item.original?.event !== null && item.original?.event !== undefined;

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden group ${isPinned ? "border-l-4 border-l-blue-500 border border-slate-200" : "border border-slate-200"}`}>
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-50/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardContent className="p-4 relative z-10">
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header with badges */}
            <div className="flex items-start gap-2 mb-3 flex-wrap">
              {isPinned && (
                <Pin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              )}
              <div className="flex gap-2 flex-wrap">
                <Badge className={`text-xs font-medium ${getTypeColor(item.type)}`}>{item.type}</Badge>
                <Badge className={`text-xs font-medium ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</Badge>
              </div>
            </div>

            {/* Title and Description */}
            <div className="mb-3">
              <h4 className="line-clamp-1 font-semibold text-[#0a2740] group-hover:text-blue-700 transition-colors text-sm sm:text-base">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 mt-1 group-hover:text-slate-700 transition-colors">{item.description}</p>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
              {occupancy && (
                <div className="flex items-center gap-1.5">
                  <Users2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium truncate">{occupancy.label}</span>
                </div>
              )}
              {isEventT && item.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{new Date(item.date).toLocaleDateString('es-ES')}</span>
                </div>
              )}
              {isEventT && item.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex gap-2 w-full sm:w-auto sm:flex-col lg:flex-row ml-0 sm:ml-2 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 sm:flex-auto text-xs sm:text-sm h-8 px-2 transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              onClick={() => onViewDetails(item)}
            >
              <Eye className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline ml-1">Ver</span>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 sm:flex-auto text-xs sm:text-sm h-8 px-2 transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                    onClick={() => onPublish(item)}
                  >
                    <Share className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline ml-1">Publicar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  <p>Publicar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(item)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAttendance(item)} className="cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Ver participantes
                </DropdownMenuItem>
                {hasEnded && (
                  <DropdownMenuItem onClick={() => onAttendance(item)} className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Asistencia
                  </DropdownMenuItem>
                )}
                {/* Show event edit if it's an event OR if it's a publication with an event */}
                {(isEventT || hasEvent) && (
                  <DropdownMenuItem onClick={() => onEditEvent(item)} className="cursor-pointer">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar Evento
                  </DropdownMenuItem>
                )}
                {/* Show publication edit if it's a publication OR if it's an event with publication */}
                {(!isEventT || hasPublication) && (
                  <DropdownMenuItem onClick={() => onEditPublication(item)} className="cursor-pointer">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar Publicación
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
      </CardContent>
    </Card>
  );
};

export default EventListItem;
