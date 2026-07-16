import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BellRing,
  ChevronDown,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";

import { NAV_ITEMS } from "@/constants/navigation";
import { useNotificationStore } from "@/store/notification.store";

type SidebarProps = {
  onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { openDrawer } = useNotificationStore();

  const handleSettingsItemClick = (type: "notifications" | "default") => {
    if (type === "notifications") {
      openDrawer();
    }

    setIsSettingsOpen(false);
    onNavigate?.();
  };

  return (
    <aside className="flex h-full w-full flex-col bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
      {/* Brand Section */}
      <div className="border-b border-slate-200/60 p-4 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-300 dark:text-slate-100">
              {/* Agentic<span className="text-blue-600 dark:text-blue-400">AP</span> */}
              <span className="hidden text-5xl font-semibold text-slate-800 dark:text-slate-100 sm:block">
              Agentic<span className="text-blue-600 dark:text-blue-400">AP</span>
            </span>
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Accounts Payable
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Main Menu
        </div>
        
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#006DB0] to-indigo-600 text-white shadow-lg shadow-blue-500/25 dark:from-blue-500 dark:to-indigo-500 dark:shadow-blue-500/30"
                  : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100/60 text-slate-500 group-hover:bg-slate-200/60 group-hover:text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 dark:group-hover:bg-slate-700/40 dark:group-hover:text-slate-300"
                }`}>
                  <item.icon size={18} />
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-white/80 dark:bg-white/60"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-slate-200/60 p-3 dark:border-slate-800/60">
        <div className="space-y-2">
          <button
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100/60 text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                <Settings size={18} />
              </span>
              <span>Settings</span>
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isSettingsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isSettingsOpen && (
            <div className="ml-2 space-y-1 rounded-xl border border-slate-200/60 bg-white/70 p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
              <button
                onClick={() => handleSettingsItemClick("default")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              >
                <UserRound size={16} className="text-blue-600 dark:text-blue-400" />
                <span>Profile Settings</span>
              </button>

              <button
                onClick={() => handleSettingsItemClick("default")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              >
                <SlidersHorizontal size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>Application Preferences</span>
              </button>

              <button
                onClick={() => handleSettingsItemClick("notifications")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              >
                <BellRing size={16} className="text-amber-600 dark:text-amber-400" />
                <span>Notification Settings</span>
              </button>

              <button
                onClick={() => handleSettingsItemClick("default")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
              >
                <ShieldCheck size={16} className="text-rose-600 dark:text-rose-400" />
                <span>Security Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* Version Info */}
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            v2.4.0 • © 2026 AgenticAP
          </p>
        </div>
      </div>
    </aside>
  );
}