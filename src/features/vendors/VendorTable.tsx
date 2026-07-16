import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteVendor,
  getVendors,
} from "@/services/vendor.service";
import type { Vendor } from "@/types/vendor";
import VendorDialog from "./VendorDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Hash,
  CreditCard,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
  FileText,
  X,
  Download,
} from "lucide-react";
import { exportCsv } from "@/utils/exportCsv";

export default function VendorTable() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const PAGE_SIZE = 5;

  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vendors"],
      });
      toast.success("Vendor deleted successfully", {
        icon: "✅",
        duration: 3000,
      });
    },
    onError: () => {
      toast.error("Failed to delete vendor", {
        icon: "❌",
        duration: 4000,
      });
    },
  });

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'ACTIVE': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50',
      'PENDING': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50',
      'INACTIVE': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50',
    };
    return statusMap[status] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50';
  };

  const filtered = useMemo(() => {
    return data
      .filter((vendor: Vendor) => {
        const searchMatch =
          vendor.vendorName
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          vendor.vendorCode
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          vendor.gstNumber
            .toLowerCase()
            .includes(search.toLowerCase());

        const statusMatch =
          statusFilter === "ALL"
            ? true
            : vendor.status === statusFilter;

        return searchMatch && statusMatch;
      })
      .sort((a: Vendor, b: Vendor) =>
        a.vendorName.localeCompare(b.vendorName)
      );
  }, [data, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const startIndex = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, filtered.length);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const goToNextPage = () => {
    setPage((currentPage) => Math.min(currentPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const goToPage = (nextPage: number) => {
    setPage(nextPage);
  };

  const getPageNumbers = () => {
    const pages: Array<number | string> = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let index = 1; index <= totalPages; index += 1) {
        pages.push(index);
      }
    } else if (page <= 3) {
      for (let index = 1; index <= 4; index += 1) {
        pages.push(index);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let index = totalPages - 3; index <= totalPages; index += 1) {
        pages.push(index);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let index = page - 1; index <= page + 1; index += 1) {
        pages.push(index);
      }
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleExportVendors = () => {
  const exportData = filtered.map(
    (vendor: any) => ({
      VendorName:
        vendor.vendorName,

      VendorCode:
        vendor.vendorCode,

      Country:
        vendor.country,

      Email:
        vendor.email,

      Phone:
        vendor.phone,

      Status:
        vendor.status,

      GSTNumber:
        vendor.gstNumber,
    })
  );

  exportCsv(
    exportData,
    `vendors-${new Date()
      .toISOString()
      .slice(0, 10)}`
  );
};

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-10 w-full lg:max-w-xs" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 w-full sm:w-36" />
            <Skeleton className="h-10 w-full sm:w-32" />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/60 dark:bg-slate-900/50">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 text-center backdrop-blur-sm dark:border-red-800/30 dark:bg-red-950/20">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500 dark:text-red-400" />
        <h3 className="mb-1 text-sm font-semibold text-red-700 dark:text-red-300">
          Failed to Load Vendors
        </h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Vendors
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filtered.length} vendor{filtered.length > 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportVendors}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          <Button
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-105"
            onClick={() => {
              setSelectedVendor(undefined);
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/60 focus:border-blue-400 dark:focus:border-blue-500"
            placeholder="Search by name, code, or GST..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200/60 bg-white/50 pl-9 pr-8 text-sm text-slate-700 transition-all hover:border-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-slate-700/60 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-600 dark:focus:border-blue-500 sm:w-40"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {(search || statusFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-blue-200/60 bg-blue-50/30 p-12 text-center backdrop-blur-sm transition-all hover:border-blue-300/80 hover:bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-950/10 dark:hover:border-blue-700/40">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Users className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
            No Vendors Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {search || statusFilter !== "ALL" 
              ? "No vendors match the current filters. Try adjusting your search criteria."
              : "Get started by adding your first vendor."}
          </p>
          {(search || statusFilter !== "ALL") && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50/50 text-left dark:border-slate-700/60 dark:bg-slate-800/30">
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" />
                      Name
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5" />
                      Code
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" />
                      GST
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((vendor: Vendor) => (
                  <tr
                    key={vendor.id}
                    className="border-b border-slate-100/60 transition-all hover:bg-slate-50/80 dark:border-slate-700/30 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-medium text-white shadow-md shadow-blue-500/20 dark:from-blue-400 dark:to-indigo-400 dark:shadow-blue-400/20">
                          {vendor.vendorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {vendor.vendorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <code className="rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {vendor.vendorCode}
                      </code>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-slate-600 dark:text-slate-300">
                        {vendor.gstNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge className={`border ${getStatusColor(vendor.status)}`}>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border-slate-200/60 bg-white/90 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/90">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-slate-800 dark:text-slate-100">
                                Delete Vendor?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                                This action cannot be undone. This will permanently delete the vendor
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {" "}{vendor.vendorName}
                                </span> and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-slate-200/60 dark:border-slate-700/60">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(vendor.id)}
                                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                              >
                                Delete Vendor
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200/60 px-4 py-3 dark:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Showing {startIndex} to {endIndex} of {filtered.length} entries
          </p>
          
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={page === 1}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                page === 1
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-0.5">
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === 'number' && goToPage(pageNumber)}
                  disabled={pageNumber === '...'}
                  className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    pageNumber === page
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 dark:from-blue-500 dark:to-indigo-500'
                      : pageNumber === '...'
                      ? 'cursor-default text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={page === totalPages}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                page === totalPages
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Vendor Dialog */}
      <VendorDialog
        open={open}
        onOpenChange={setOpen}
        vendor={selectedVendor}
      />
    </div>
  );
}