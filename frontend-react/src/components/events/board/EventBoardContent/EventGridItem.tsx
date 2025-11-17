import { Edit, Eye, MoreVertical, Pin, Share, Trash2 } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { getOccupancyLevel, getStatusColor, getStatusLabel, getTypeColor, isEventType } from "../../../../features/events/event-board.helpers";
import { Badge } from "../../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import type { ContentItem, ItemToDelete } from "./event-board-content";

// Componente Interno: Grid Item
const EventGridItem = ({
  item,
  isPinned,
  onViewDetails,
  onDeleteClick,
}: {
  item: ContentItem;
  isPinned: boolean;
  onViewDetails: (item: ContentItem) => void;
  onDeleteClick: (item: ItemToDelete) => void;
}) => {
  const isEvent = isEventType(item.type);
  const occupancy =
    isEvent && item.capacity && item.enrolled
      ? getOccupancyLevel(item.enrolled, item.capacity)
      : null;

  return (
    <Card className={isPinned ? "border-blue-500 border-2" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            <Badge className={`text-xs ${getTypeColor(item.type)}`}>
              {item.type}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(item.status)}`}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {isPinned && <Pin className="h-4 w-4 text-blue-500" />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    onDeleteClick({
                      id: item.id,
                      type: item.type,
                      title: item.title,
                    })
                  }
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <h4 className="line-clamp-2 mb-2">{item.title}</h4>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {/* ... (Detalles: Fecha, Hora, Ubicación, Ocupación, Vistas) ... */}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(item)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button size="sm" variant="outline" disabled>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" disabled>
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventGridItem;