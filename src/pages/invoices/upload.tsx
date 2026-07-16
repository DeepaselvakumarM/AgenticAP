import InvoiceUpload from
  "@/features/invoices/components/InvoiceUpload";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          Upload Invoice
        </span>
      </h1>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <InvoiceUpload />
      </div>
    </div>
  );
}