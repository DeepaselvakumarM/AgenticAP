import VendorTable from "@/features/vendors/VendorTable";

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          Vendors
        </span>
      </h1>

      <div className="overflow-hidden rounded-xl border bg-card p-3 sm:p-4">
        <VendorTable />
      </div>
    </div>
  );
}







