import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notification.store";

export default function NotificationBell() {
  const {
    unreadCount,
    openDrawer,
  } = useNotificationStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openDrawer}
    >
      <Bell className="h-5 w-5" />

      {unreadCount > 0 && (
        <span
          className="
            absolute
            -top-1
            -right-1
            min-w-5
            h-5
            rounded-full
            bg-red-500
            px-1
            flex
            items-center
            justify-center
            text-[10px]
            text-white
          "
        >
          {unreadCount}
        </span>
      )}
    </Button>
  );
}