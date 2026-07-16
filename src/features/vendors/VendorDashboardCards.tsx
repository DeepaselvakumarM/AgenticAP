import { useQuery } from "@tanstack/react-query";
import { getVendorDashboard } from "@/services/vendor.service";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardCards() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: getVendorDashboard,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/60">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6 bg-red-50/50 dark:bg-red-950/20 border-red-200/60 dark:border-red-800/30">
            <p className="text-sm text-red-600 dark:text-red-400">Error loading data</p>
            <p className="mt-2 text-2xl font-semibold text-red-700 dark:text-red-300">--</p>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Vendors",
      value: data.totalVendors,
      icon: Users,
      color: "blue",
      trend: "+12%",
      trendDirection: "up",
      subtitle: "All registered vendors"
    },
    {
      title: "Active",
      value: data.activeVendors,
      icon: CheckCircle,
      color: "emerald",
      trend: "+8%",
      trendDirection: "up",
      subtitle: "Currently active"
    },
    {
      title: "Pending",
      value: data.pendingVendors,
      icon: Clock,
      color: "amber",
      trend: "-3%",
      trendDirection: "down",
      subtitle: "Awaiting verification"
    },
    {
      title: "Inactive",
      value: data.inactiveVendors,
      icon: XCircle,
      color: "slate",
      trend: "0%",
      trendDirection: "neutral",
      subtitle: "Not currently active"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, iconBg: string, text: string, border: string }> = {
      blue: {
        bg: "bg-blue-50/80 dark:bg-blue-950/30",
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
        text: "text-blue-700 dark:text-blue-300",
        border: "border-blue-200/60 dark:border-blue-800/30"
      },
      emerald: {
        bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
        iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200/60 dark:border-emerald-800/30"
      },
      amber: {
        bg: "bg-amber-50/80 dark:bg-amber-950/30",
        iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200/60 dark:border-amber-800/30"
      },
      slate: {
        bg: "bg-slate-50/80 dark:bg-slate-800/30",
        iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-400",
        text: "text-slate-700 dark:text-slate-300",
        border: "border-slate-200/60 dark:border-slate-700/30"
      }
    };
    return colorMap[color] || colorMap.slate;
  };

  const getTrendIcon = (direction: string) => {
    if (direction === "up") return <TrendingUp className="h-3.5 w-3.5" />;
    if (direction === "down") return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendColor = (direction: string) => {
    if (direction === "up") return "text-emerald-600 dark:text-emerald-400";
    if (direction === "down") return "text-red-600 dark:text-red-400";
    return "text-slate-400 dark:text-slate-500";
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        const Icon = card.icon;
        
        return (
          <Card 
            key={index}
            className={`
              relative overflow-hidden p-6 backdrop-blur-sm transition-all duration-300 
              hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
              ${colors.bg} border ${colors.border}
            `}
          >
            {/* Background Decoration */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" />
            <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-gradient-to-tr from-white/5 to-transparent dark:from-white/3" />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {card.value}
                </p>
              </div>
              <div className={`
                rounded-xl p-2.5 shadow-sm
                ${colors.iconBg}
              `}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-200/40 pt-3 dark:border-slate-700/40">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {card.subtitle}
              </p>
              <div className="flex items-center gap-1.5">
                <span className={`
                  inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                  ${getTrendColor(card.trendDirection)}
                  ${card.trendDirection === 'up' ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''}
                  ${card.trendDirection === 'down' ? 'bg-red-50 dark:bg-red-950/30' : ''}
                  ${card.trendDirection === 'neutral' ? 'bg-slate-50 dark:bg-slate-800/30' : ''}
                `}>
                  {getTrendIcon(card.trendDirection)}
                  {card.trend}
                </span>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}