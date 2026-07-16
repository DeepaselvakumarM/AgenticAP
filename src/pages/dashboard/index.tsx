import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import DashboardCards from "@/features/dashboard/DashboardCards";
import { getDashboardStats } from "@/services/dashboard.service";
import InvoiceStatusChart from "@/features/dashboard/InvoiceStatusChart";
import InvoicesPerDayChart from "@/features/dashboard/InvoicesPerDayChart";
import VendorWiseInvoiceChart from "@/features/dashboard/VendorWiseInvoiceChart";
import AverageProcessingTimeChart from "@/features/dashboard/AverageProcessingTimeChart";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
  });

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:bg-slate-900/80 dark:ring-white/10 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 transition-colors duration-300">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Invoice Dashboard
              </span>
              <span className="hidden sm:inline-flex h-1.5 w-1.5 rounded-full bg-blue-500/60 dark:bg-blue-400/60"></span>
              <span className="hidden text-sm font-normal text-slate-400 dark:text-slate-500 sm:inline">
                Overview
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Real-time insights into your invoice processing
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="group relative w-full gap-2 border-slate-200 bg-white/50 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 sm:w-auto"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["dashboard"],
              })
            }
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 transition-all ${
                isFetching ? "animate-spin text-blue-500 dark:text-blue-400" : "group-hover:rotate-90"
              }`}
            />
            <span className="font-medium dark:text-slate-200">
              {isFetching ? "Refreshing..." : "Refresh Data"}
            </span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-2xl dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-purple-400/5"></div>
          <div className="relative">
            <DashboardCards />
          </div>
        </div>

        {/* Charts Grid - First Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Invoice Status Distribution
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                Overview
              </span>
            </div>
            <InvoiceStatusChart data={data.statusDistribution} />
          </div>

          <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Daily Invoice Volume
              </h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                Trend
              </span>
            </div>
            <InvoicesPerDayChart data={data.invoicesPerDay} />
          </div>
        </div>

        {/* Charts Grid - Second Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Vendor-wise Distribution
              </h3>
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                Analysis
              </span>
            </div>
            <VendorWiseInvoiceChart data={data.vendorWiseInvoiceCount} />
          </div>

          <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Average Processing Time
              </h3>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                Performance
              </span>
            </div>
            <AverageProcessingTimeChart data={data.averageProcessingTime} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Last updated: {new Date().toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 dark:text-slate-500">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}