import { create } from "zustand";

interface NotificationStore {
  isOpen: boolean;

  unreadCount: number;

  openDrawer: () => void;

  closeDrawer: () => void;

  setUnreadCount: (count: number) => void;
}

export const useNotificationStore =
  create<NotificationStore>((set) => ({
    isOpen: false,

    unreadCount: 0,

    openDrawer: () =>
      set({
        isOpen: true,
      }),

    closeDrawer: () =>
      set({
        isOpen: false,
      }),

    setUnreadCount: (count) =>
      set({
        unreadCount: count,
      }),
  }));