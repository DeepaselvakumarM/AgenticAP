import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import NotificationDrawer from
  "@/features/notifications/NotificationDrawer";

import { useSocketEvents } from
  "@/hooks/useSocketEvents";

export default function AppLayout() {
  useSocketEvents();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r bg-background shadow-xl transition-transform duration-200 lg:static lg:block lg:w-64 lg:translate-x-0 lg:shadow-none ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <NotificationDrawer />
    </div>
  );
}