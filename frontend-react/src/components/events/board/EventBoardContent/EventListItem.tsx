import { Card, CardContent } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";

import { Edit, Trash2, Eye, Pin, Share, Settings, Users } from "lucide-react";
import {
  getTypeColor,
  getStatusColor,
  getStatusLabel,
  getOccupancyLevel,
  isEventType,
} from "../../../../features/events/event-board.helpers"; // Importar helpers
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
}: {
  item: ContentItem;
  isPinned: boolean;
  onViewDetails: (item: ContentItem) => void;
  onDeleteClick: (item: ItemToDelete) => void;
  onPublish: (item: ContentItem) => void;
  onAttendance: (item: ContentItem) => void;
}) => {
  const isEvent = isEventType(item.type);

  const occupancy = isEvent && item.capacity && item.enrolled ? getOccupancyLevel(item.enrolled, item.capacity) : null;
  
  // Check if event has ended
  const hasEnded = isEvent && new Date(item.date) < new Date();

  return (
    <Card className={isPinned ? "border-blue-500 border-l-4" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isPinned && <Pin className="h-4 w-4 text-blue-500" />}
              <h4 className="line-clamp-1">{item.title}</h4>
              <Badge className={`text-xs ${getTypeColor(item.type)}`}>{item.type}</Badge>
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</Badge>
            </div>
            <div>{occupancy?.label}</div>
            {/* ... (Descripción y detalles en línea) ... */}
          </div>
          <div className="flex gap-1">
            {hasEnded && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" onClick={() => onAttendance(item)}>
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5}>
                    <p>Asistencia</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button size="sm" variant="ghost" onClick={() => onViewDetails(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" disabled>
              <Edit className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => onPublish(item)}>
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  <p>Publicar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button size="sm" variant="ghost" disabled>
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() =>
                onDeleteClick({
                  id: item.id,
                  type: item.type,
                  title: item.title,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventListItem;
