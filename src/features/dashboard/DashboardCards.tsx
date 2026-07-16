import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "./StatCard";
import { 
  FileText, 
  UserCheck, 
  CheckCircle, 
  Loader2, 
  XCircle,
  TrendingUp,
  Clock
} from "lucide-react";

export default function DashboardCards() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index} 
            className="rounded-2xl border border-slate-200/60 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 text-center backdrop-blur-sm dark:border-red-800/30 dark:bg-red-950/20">
        <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500 dark:text-red-400" />
        <h3 className="mb-1 text-sm font-semibold text-red-700 dark:text-red-300">
          Failed to Load Dashboard
        </h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
      </div>
    );
  }

  // Define all stats with their configurations
  const stats = [
    {
      title: "Total Invoices",
      value: data.totalInvoices,
      icon: FileText,
      color: "blue",
      trend: "+12%",
      trendDirection: "up",
      description: "All time invoices"
    },
    {
      title: "Human Review",
      value: data.humanReview,
      icon: UserCheck,
      color: "amber",
      trend: "-5%",
      trendDirection: "down",
      description: "Pending review"
    },
    {
      title: "Approved",
      value: data.approved,
      icon: CheckCircle,
      color: "emerald",
      trend: "+8%",
      trendDirection: "up",
      description: "Successfully processed"
    },
    {
      title: "Processing",
      value: data.processing,
      icon: Loader2,
      color: "indigo",
      trend: "+3%",
      trendDirection: "up",
      description: "Currently in progress"
    },
    {
      title: "Failed",
      value: data.failed,
      icon: XCircle,
      color: "red",
      trend: "-2%",
      trendDirection: "down",
      description: "Requires attention"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { 
      bg: string, 
      iconBg: string, 
      text: string, 
      trendBg: string,
      trendText: string,
      border: string 
    }> = {
      blue: {
        bg: "bg-blue-50/80 dark:bg-blue-950/30",
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
        text: "text-blue-700 dark:text-blue-300",
        trendBg: "bg-blue-50 dark:bg-blue-950/30",
        trendText: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200/60 dark:border-blue-800/30"
      },
      amber: {
        bg: "bg-amber-50/80 dark:bg-amber-950/30",
        iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
        text: "text-amber-700 dark:text-amber-300",
        trendBg: "bg-amber-50 dark:bg-amber-950/30",
        trendText: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200/60 dark:border-amber-800/30"
      },
      emerald: {
        bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
        iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
        text: "text-emerald-700 dark:text-emerald-300",
        trendBg: "bg-emerald-50 dark:bg-emerald-950/30",
        trendText: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200/60 dark:border-emerald-800/30"
      },
      indigo: {
        bg: "bg-indigo-50/80 dark:bg-indigo-950/30",
        iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
        text: "text-indigo-700 dark:text-indigo-300",
        trendBg: "bg-indigo-50 dark:bg-indigo-950/30",
        trendText: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200/60 dark:border-indigo-800/30"
      },
      red: {
        bg: "bg-red-50/80 dark:bg-red-950/30",
        iconBg: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
        text: "text-red-700 dark:text-red-300",
        trendBg: "bg-red-50 dark:bg-red-950/30",
        trendText: "text-red-600 dark:text-red-400",
        border: "border-red-200/60 dark:border-red-800/30"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTrendIcon = (direction: string) => {
    if (direction === "up") return <TrendingUp className="h-3 w-3" />;
    if (direction === "down") return <TrendingUp className="h-3 w-3 rotate-180" />;
    return <Clock className="h-3 w-3" />;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;
        const isTrendUp = stat.trendDirection === "up";
        
        return (
          <div
            key={index}
            className={`
              group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300
              hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
              ${colors.bg} ${colors.border}
            `}
          >
            {/* Decorative Background */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" />
            <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-gradient-to-tr from-white/5 to-transparent dark:from-white/3" />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  {stat.title}
                </p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
              <div className={`
                rounded-xl p-2.5 shadow-sm transition-all duration-300
                group-hover:scale-110 group-hover:shadow-md
                ${colors.iconBg}
              `}>
                <Icon className={`h-5 w-5 ${stat.color === 'indigo'}`} />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                {stat.description}
              </p>
              <div className={`
                inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                ${isTrendUp ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'}
              `}>
                {getTrendIcon(stat.trendDirection)}
                {stat.trend}
              </div>
            </div>

            {/* Progress Bar (optional visual indicator) */}
            <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-700/60">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  stat.color === 'blue' ? 'bg-blue-500 dark:bg-blue-400' :
                  stat.color === 'amber' ? 'bg-amber-500 dark:bg-amber-400' :
                  stat.color === 'emerald' ? 'bg-emerald-500 dark:bg-emerald-400' :
                  stat.color === 'indigo' ? 'bg-indigo-500 dark:bg-indigo-400' :
                  'bg-red-500 dark:bg-red-400'
                }`}
                style={{ 
                  width: `${Math.min((stat.value / data.totalInvoices) * 100, 100)}%`,
                  
                }}
              />
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-white/5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}