import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { getNotifications } from "@/services/notifications.service";
import { useNotificationStore } from "@/store/notification.store";
import type { Notification } from "@/types/notifications";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  XCircle,
  Clock,
  Loader2,
  CheckCheck,
  Circle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationDrawer() {
  const {
    isOpen,
    closeDrawer,
    setUnreadCount,
    unreadCount: storeUnreadCount,
  } = useNotificationStore();

  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const unreadCount = data.filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => {
    setUnreadCount(unreadCount);
  }, [unreadCount, setUnreadCount]);

  // Filter notifications
  const filteredData = data.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredData.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const getNotificationIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  const getNotificationColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "success":
        return "border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-800/30 dark:bg-emerald-950/20";
      case "error":
        return "border-red-200/60 bg-red-50/50 dark:border-red-800/30 dark:bg-red-950/20";
      case "warning":
        return "border-amber-200/60 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-950/20";
      case "info":
        return "border-blue-200/60 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-950/20";
      default:
        return "border-slate-200/60 bg-white/50 dark:border-slate-700/60 dark:bg-slate-900/50";
    }
  };

  const handleMarkAsRead = (id: string) => {
    // In a real app, you would call an API to mark as read
    // For now, we'll just update the local state
    console.log("Mark as read:", id);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, you would call an API to mark all as read
    console.log("Mark all as read");
  };

  if (error) {
    console.error("Notifications Error:", error);
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDrawer();
        }
      }}
    >
      <SheetContent 
        side="right" 
        className="w-full sm:w-[420px] md:w-[480px] p-0 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 border-l-slate-200/60 dark:border-l-slate-700/60"
      >
        {/* Header */}
        <div className="border-b border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6">
          <SheetHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 p-2 shadow-md shadow-blue-500/20 dark:shadow-blue-400/20">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Notifications
                  </SheetTitle>
                  <SheetDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                  </SheetDescription>
                </div>
              </div>
              
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 rounded-lg bg-slate-100/50 p-0.5 dark:bg-slate-800/50">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === "all"
                    ? "bg-white text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-200"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === "unread"
                    ? "bg-white text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-200"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === "read"
                    ? "bg-white text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-200"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Read
              </button>
            </div>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-4 sm:p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 dark:text-blue-400" />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Loading notifications...
              </p>
            </div>
          )}

          {!isLoading && data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <Bell className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                You're all caught up!
              </p>
            </div>
          )}

          {!isLoading && filteredData.length === 0 && data.length > 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No {filter} notifications found
              </p>
            </div>
          )}

          {!isLoading &&
            Object.entries(groupedNotifications).map(([date, notifications]) => (
              <div key={date} className="mb-6 last:mb-0">
                <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h4>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        group relative rounded-xl border p-4 transition-all duration-200
                        hover:shadow-md hover:scale-[1.01]
                        ${getNotificationColor(notification.type)}
                        ${!notification.read ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400' : ''}
                        ${selectedNotification === notification.id ? 'ring-2 ring-blue-400/50 dark:ring-blue-400/30' : ''}
                      `}
                      onClick={() => setSelectedNotification(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 pt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-slate-700 dark:text-slate-200">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0">
                                <Circle className="h-2 w-2 fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400" />
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-center gap-3">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              <Clock className="mr-1 inline h-3 w-3" />
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-xs font-medium text-blue-600 opacity-0 transition-opacity hover:text-blue-700 group-hover:opacity-100 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/60 dark:border-slate-700/60 p-4 sm:p-6">
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Total: {data.length} notifications</span>
            <button
              onClick={() => refetch()}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}