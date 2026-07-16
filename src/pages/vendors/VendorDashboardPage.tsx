import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getVendorDashboard,
} from "@/services/vendor.service";
import VendorDashboardCards from "@/features/vendors/VendorDashboardCards";
import VendorCountryChart from "@/features/vendors/charts/VendorCountryChart";
import VendorCreationTrendChart from "@/features/vendors/charts/VendorCreationTrendChart";
import TopVendorsChart from "@/features/vendors/charts/TopVendorsChart";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Users, Building2, Calendar, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: getVendorDashboard,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 dark:bg-slate-900/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="mt-1 h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-2xl" />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid gap-6 xl:grid-cols-2">
            <Skeleton className="h-[400px] rounded-2xl" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:bg-slate-900/80 dark:ring-white/10 p-4 sm:p-6 transition-colors duration-300">
          {/* Decorative Background */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-400/5 dark:to-indigo-400/5 blur-2xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-to-tr from-purple-500/5 to-pink-500/5 dark:from-purple-400/5 dark:to-pink-400/5 blur-2xl" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Vendor Dashboard
                </span>
                <span className="hidden sm:inline-flex h-1.5 w-1.5 rounded-full bg-blue-500/60 dark:bg-blue-400/60"></span>
                <span className="hidden text-sm font-normal text-slate-400 dark:text-slate-500 sm:inline">
                  Analytics & Insights
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                Monitor vendor performance, trends, and distribution across your organization
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="group relative w-full gap-2 border-slate-200 bg-white/50 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 sm:w-auto"
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ["vendor-dashboard"],
                });
                refetch();
              }}
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
        </div>

        {/* Quick Stats Overview */}
        {/* <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="group rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-4 transition-all hover:scale-[1.02] hover:shadow-md dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-1.5 shadow-md shadow-blue-500/20 dark:shadow-blue-400/20">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total</span>
              </div>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-200">{data.totalVendors}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">All registered vendors</p>
          </div>

          <div className="group rounded-xl bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-4 transition-all hover:scale-[1.02] hover:shadow-md dark:from-emerald-950/30 dark:to-teal-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 shadow-md shadow-emerald-500/20 dark:shadow-emerald-400/20">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                {Math.round((data.activeVendors / data.totalVendors) * 100)}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-200">{data.activeVendors}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Currently active</p>
          </div>

          <div className="group rounded-xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-4 transition-all hover:scale-[1.02] hover:shadow-md dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-1.5 shadow-md shadow-amber-500/20 dark:shadow-amber-400/20">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending</span>
              </div>
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">Review</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-200">{data.pendingVendors}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Awaiting verification</p>
          </div>

          <div className="group rounded-xl bg-gradient-to-br from-slate-50/80 to-gray-50/80 p-4 transition-all hover:scale-[1.02] hover:shadow-md dark:from-slate-800/30 dark:to-gray-800/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-slate-400 to-gray-400 p-1.5 shadow-md shadow-slate-400/20 dark:shadow-slate-400/20">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Inactive</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Inactive</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-200">{data.inactiveVendors}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Not currently active</p>
          </div>
        </div> */}

        {/* Dashboard Cards with Glow Effect */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-2xl dark:from-blue-400/5 dark:via-indigo-400/5 dark:to-purple-400/5"></div>
          <div className="relative">
            <VendorDashboardCards />
          </div>
        </div>

        {/* Charts Grid - First Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-1.5 shadow-md shadow-blue-500/20 dark:shadow-blue-400/20">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Country Distribution
                </h3>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                Geography
              </span>
            </div>
            <VendorCountryChart data={data.countryDistribution} />
          </div>

          <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 shadow-md shadow-emerald-500/20 dark:shadow-emerald-400/20">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Vendor Creation Trend
                </h3>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                Monthly
              </span>
            </div>
            <VendorCreationTrendChart data={data.monthlyCreation} />
          </div>
        </div>

        {/* Top Vendors Chart - Full Width */}
        <div className="group rounded-2xl bg-white/80 p-4 backdrop-blur-sm shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md hover:ring-blue-200/50 dark:bg-slate-900/80 dark:ring-white/10 dark:hover:ring-blue-500/30 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 shadow-md shadow-purple-500/20 dark:shadow-purple-400/20">
                <Award className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Top Performing Vendors
              </h3>
            </div>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              Performance
            </span>
          </div>
          <TopVendorsChart data={data.topVendors} />
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/60 pt-4 dark:border-slate-800/60 sm:flex-row">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Last updated: {new Date().toLocaleString()}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Live</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span>© 2026 Vendor Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}