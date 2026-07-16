import { api } from "@/lib/api";
import type { Notification } from "@/types/notifications";

export const getNotifications = async (): Promise<
  Notification[]
> => {
  const { data } = await api.get("/notifications");
  return data;
};