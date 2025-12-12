import { create } from 'zustand';
import NotificationAPI from '../services/api/endpoints/notifications';

interface NotificationState {
  notifications: API.Notification[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const { notifications } = await NotificationAPI.listMyNotifications();
      const unreadCount = notifications.filter(n => !n.read_at).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      set({ error: "Failed to load notifications", loading: false });
    }
  },

  markAsRead: async (id: string) => {
    // Optimistic update
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.read_at).length;
    
    set({ notifications: updatedNotifications, unreadCount });

    // TODO: Call API to mark as read if endpoint exists
    // try {
    //   await NotificationAPI.markAsRead(id);
    // } catch (error) {
    //   // Revert if failed?
    // }
  },

  markAllAsRead: async () => {
      const { notifications } = get();
      const updatedNotifications = notifications.map(n => ({ ...n, read_at: new Date().toISOString() }));
      set({ notifications: updatedNotifications, unreadCount: 0 });
      
      // TODO: Call API
  }
}));
