import { useState } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { uploadInvoice } from "@/services/invoice.service";

export default function InvoiceUpload() {
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: uploadInvoice,
    onSuccess: () => {
      toast.success("Invoice uploaded successfully", {
        icon: "✅",
        duration: 4000,
      });
      setFile(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Invoice upload failed. Please try again.", {
        icon: "❌",
        duration: 5000,
      });
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        // Validate file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
          toast.error("File size exceeds 10MB limit", {
            icon: "⚠️",
          });
          return;
        }
        setFile(selectedFile);
        toast.success(`${selectedFile.name} ready to upload`, {
          icon: "📄",
          duration: 3000,
        });
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === "file-invalid-type") {
        toast.error("Please upload PDF, PNG, or JPG files only", {
          icon: "📁",
        });
      }
    },
  });

  const removeFile = () => {
    setFile(null);
    toast.info("File removed", {
      icon: "🗑️",
      duration: 2000,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300
          ${isDragActive 
            ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 dark:border-blue-400 dark:bg-blue-950/20 dark:shadow-blue-400/5" 
            : "border-slate-200/70 bg-white/50 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/30 dark:hover:border-blue-500 dark:hover:bg-blue-950/10"
          }
          ${file ? "border-emerald-400 bg-emerald-50/30 dark:border-emerald-500/50 dark:bg-emerald-950/10" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {/* Icon with animation */}
          <div className={`
            relative rounded-full p-4 transition-all duration-300
            ${isDragActive 
              ? "bg-blue-100 text-blue-600 shadow-lg shadow-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400" 
              : file 
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500"
            }
          `}>
            {file ? (
              <CheckCircle className="h-8 w-8" />
            ) : (
              <UploadCloud className={`h-8 w-8 transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`} />
            )}
          </div>

          <div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
              {isDragActive 
                ? "Drop your invoice here" 
                : file 
                  ? "File ready to upload" 
                  : "Drag & drop your invoice"
              }
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {file 
                ? `${file.name} (${formatFileSize(file.size)})`
                : "PDF, PNG, or JPG up to 10MB"
              }
            </p>
          </div>

          {!file && (
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                Click to browse
              </span>
              <span>or</span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                Drag & drop
              </span>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Card */}
      {file && (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/80">
          <div className="flex items-start gap-4">
            {/* File Icon */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              <File size={24} />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-slate-700 dark:text-slate-200">
                {file.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span>{formatFileSize(file.size)}</span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600 sm:inline"></span>
                <span className="hidden sm:inline">
                  {new Date().toLocaleString()}
                </span>
                <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Ready
                </span>
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={removeFile}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              disabled={mutation.isPending}
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar (optional - can be connected to upload progress) */}
          {mutation.isPending && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Uploading...</span>
                <span>Processing</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-[progress_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          className="relative flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-105 disabled:opacity-50 disabled:shadow-none sm:flex-none sm:min-w-[200px]"
          disabled={!file || mutation.isPending}
          onClick={() => file && mutation.mutate(file)}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Upload Invoice
            </>
          )}
        </Button>

        {file && !mutation.isPending && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Click to upload {file.name}
          </p>
        )}
      </div>

      {/* Supported Formats Hint */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
        <span>Supported formats:</span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400"></span>
          PDF
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          PNG
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"></span>
          JPG
        </span>
        <span className="text-slate-300 dark:text-slate-600">|</span>
        <span>Max size: 10MB</span>
      </div>
    </div>
  );
}