import { create } from "zustand";

interface UIStore {
  isNotificationDrawerOpen: boolean;
  toggleNotificationDrawer: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isNotificationDrawerOpen: false,

  toggleNotificationDrawer: () =>
    set((state) => ({
      isNotificationDrawerOpen: !state.isNotificationDrawerOpen,
    })),
}));