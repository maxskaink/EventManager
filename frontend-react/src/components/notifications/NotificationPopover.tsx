import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { useNotificationStore } from "../../stores/notification.store";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";
import { useNavigate } from "react-router";


const getNotificationdData = (notification: API.Notification) => {
  if (notification.type === "App\\Notifications\\NewPublicationNotification") {
    const data = notification.data as {
      title: string
      publication_id: number,
      publication_title: string,
      author_id: number,
      author_name: string,
      message: string
    }
    return {
      message: `Podría interesarte: ${data.publication_title}...`,
      redirectTo: `/publications/${data.publication_id}`
    }
  }

  return {
    message: notification.data?.message as string ?? "Nueva notificación",
    redirectTo: undefined
  }
}

export function NotificationPopover() {

  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // Poll every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = (id: string) => {
      markAsRead(id);
  };

  console.log(notifications)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600 border-none">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold leading-none">Notificaciones</h4>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-auto p-0 text-muted-foreground hover:text-primary"
                onClick={() => markAllAsRead()}
            >
              Marcar todo como leído
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const { message, redirectTo } = getNotificationdData(notification);
                return(
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read_at && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                  onClick={() => {
                    handleMarkAsRead(notification.id)
                    if (redirectTo) {
                      navigate(redirectTo)
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", !notification.read_at && "font-medium")}>
                        {message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read_at && (
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                </div>
              )})}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
