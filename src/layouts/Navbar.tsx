import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Building2, FileText, Loader2, Menu, Search } from "lucide-react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import NotificationBell from "@/features/notifications/NotificationBell";
import { getInvoices } from "@/services/invoice.service";
import { getVendors } from "@/services/vendor.service";
import type { Invoice } from "@/types/invoice";
import type { Vendor } from "@/types/vendor";

type NavbarProps = {
  onMenuClick?: () => void;
};

type SearchResult = {
  id: string;
  type: "invoice" | "vendor";
  title: string;
  subtitle: string;
  href: string;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: invoices = [], isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const { data: vendors = [], isLoading: isVendorsLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  const searchResults = useMemo<SearchResult[]>(() => {
    const term = searchQuery.trim().toLowerCase();

    if (!term) return [];

    const invoiceResults = (invoices as Invoice[])
      .filter((invoice) => {
        const haystack = `${invoice.invoiceNumber} ${invoice.vendor} ${invoice.status}`.toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, 4)
      .map((invoice) => ({
        id: invoice.id,
        type: "invoice" as const,
        title: invoice.invoiceNumber,
        subtitle: `${invoice.vendor} • ${invoice.status}`,
        href: `/invoices/list?search=${encodeURIComponent(invoice.invoiceNumber)}`,
      }));

    const vendorResults = (vendors as Vendor[])
      .filter((vendor) => {
        const haystack = `${vendor.vendorName} ${vendor.vendorCode} ${vendor.gstNumber} ${vendor.status}`.toLowerCase();
        return haystack.includes(term);
      })
      .slice(0, 4)
      .map((vendor) => ({
        id: vendor.id,
        type: "vendor" as const,
        title: vendor.vendorName,
        subtitle: `${vendor.vendorCode} • ${vendor.status}`,
        href: `/vendors?search=${encodeURIComponent(vendor.vendorName)}`,
      }));

    return [...invoiceResults, ...vendorResults];
  }, [invoices, searchQuery, vendors]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearchOpen(false);
      return;
    }

    setIsSearchOpen(true);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(result.href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/60 dark:bg-slate-900/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white/50 text-slate-600 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden text-lg font-semibold text-slate-800 dark:text-slate-100 sm:block">
              Invoice<span className="text-blue-600 dark:text-blue-400">Processing</span>
            </span>
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-600 shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search invoices or vendors"
                className="w-44 border-0 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 lg:w-56"
              />
            </div>

            {isSearchOpen && (
              <div className="absolute right-0 top-12 z-[60] w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {(isInvoicesLoading || isVendorsLoading) && (
                  <div className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                )}

                {!isInvoicesLoading && !isVendorsLoading && searchResults.length === 0 && (
                  <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                    No matches found.
                  </div>
                )}

                {!isInvoicesLoading && !isVendorsLoading && searchResults.length > 0 && (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSelectResult(result)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
                          {result.type === "invoice" ? <FileText className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{result.title}</p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">{result.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          <NotificationBell />

          <ThemeToggle />

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          {/* User Profile */}
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-semibold text-white shadow-md shadow-blue-500/20 dark:from-blue-400 dark:to-indigo-400 dark:shadow-blue-400/20">
                  D
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900"></span>
              </div>
              
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Deepa
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}