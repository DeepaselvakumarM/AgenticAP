import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/services/invoice.service";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Building2, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Eye,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { exportCsv } from "@/utils/exportCsv";

export default function InvoiceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const itemsPerPage = 5;

  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'paid': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50',
      'pending': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50',
      'rejected': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/50',
      'processing': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50',
    };
    return statusMap[status.toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'paid': <CheckCircle className="h-3.5 w-3.5" />,
      'pending': <Clock className="h-3.5 w-3.5" />,
      'rejected': <XCircle className="h-3.5 w-3.5" />,
      'processing': <AlertCircle className="h-3.5 w-3.5" />,
    };
    return iconMap[status.toLowerCase()] || <Clock className="h-3.5 w-3.5" />;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 0.5) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

const handleExportInvoices = () => {
  const exportData = data.map(
    (invoice: any) => ({
      InvoiceNumber:
        invoice.invoiceNumber,

      Vendor:
        invoice.vendor,

      Status:
        invoice.status,

      Amount:
        invoice.amount,

      Currency:
        invoice.currency,

      UploadedAt:
        new Date(
          invoice.uploadedAt
        ).toLocaleString(),

      Confidence:
        `${Math.round(
          invoice.confidenceScore * 100
        )}%`,
    })
  );

  exportCsv(
    exportData,
    `invoices-${new Date()
      .toISOString()
      .slice(0, 10)}`
  );
};
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        
        {/* Table Skeleton */}
        <div className="rounded-xl border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/60 dark:bg-slate-900/50">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
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
          Failed to Load Invoices
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

  if (!data.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-blue-200/60 bg-blue-50/30 p-12 text-center backdrop-blur-sm transition-all hover:border-blue-300/80 hover:bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-950/10 dark:hover:border-blue-700/40">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <FileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
          No Invoices Found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Upload your first invoice to get started with tracking
        </p>
        <button className="mt-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-105">
          Upload Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Invoice List
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.length} invoice{data.length > 1 ? 's' : ''} found
          </p>
        </div>

         <button
            onClick={handleExportInvoices}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>
              Showing {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length}
            </span>
          </div>

         
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50 text-left dark:border-slate-700/60 dark:bg-slate-800/30">
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    Invoice
                  </div>
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    Vendor
                  </div>
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5" />
                    Amount
                  </div>
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Uploaded
                  </div>
                </th>
                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Confidence
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((invoice: any) => (
                <tr 
                  key={invoice.id} 
                  className="border-b border-slate-100/60 transition-all hover:bg-slate-50/80 dark:border-slate-700/30 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {invoice.invoiceNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-600 dark:text-slate-300">
                      {invoice.vendor}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      ${invoice.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-500 dark:text-slate-400">
                      {new Date(invoice.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              invoice.confidenceScore >= 0.8 ? 'bg-emerald-500' :
                              invoice.confidenceScore >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.round(invoice.confidenceScore * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${getConfidenceColor(invoice.confidenceScore)}`}>
                        {Math.round(invoice.confidenceScore * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-200/60 px-4 py-3 dark:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </p>
          
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                currentPage === 1
                  ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-0.5">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  disabled={page === '...'}
                  className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 dark:from-blue-500 dark:to-indigo-500'
                      : page === '...'
                      ? 'cursor-default text-slate-400 dark:text-slate-500'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                currentPage === totalPages
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
    </div>
  );
}