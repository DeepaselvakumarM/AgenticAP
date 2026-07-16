import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import VendorForm from "./VendorForm";
import {
  createVendor,
  updateVendor,
} from "@/services/vendor.service";
import type { Vendor } from "@/types/vendor";
import { Building2, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
};

export default function VendorDialog({
  open,
  onOpenChange,
  vendor,
}: Props) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vendors"],
      });
      queryClient.invalidateQueries({
        queryKey: ["vendor-dashboard"],
      });
      toast.success("Vendor created successfully", {
        icon: "✅",
        duration: 3000,
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create vendor", {
        icon: "❌",
        duration: 4000,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Vendor>) =>
      updateVendor(vendor!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vendors"],
      });
      queryClient.invalidateQueries({
        queryKey: ["vendor-dashboard"],
      });
      toast.success("Vendor updated successfully", {
        icon: "✅",
        duration: 3000,
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update vendor", {
        icon: "❌",
        duration: 4000,
      });
    },
  });

  const handleSubmit = (data: Partial<Vendor>) => {
    if (vendor) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate({
        ...data,
        status: "ACTIVE",
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 border-slate-200/60 dark:border-slate-700/60 shadow-2xl">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-t-2xl">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:to-indigo-400/5" />
          
          {/* Decorative Elements */}
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/5 dark:bg-blue-400/5" />
          <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-500/5 dark:bg-indigo-400/5" />
          
          <DialogHeader className="relative p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`
                  rounded-xl p-2.5 shadow-md
                  ${vendor 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-blue-500/20 dark:shadow-blue-400/20' 
                    : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 dark:shadow-emerald-400/20'
                  }
                `}>
                  {vendor ? (
                    <Pencil className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {vendor ? "Edit Vendor" : "Create New Vendor"}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {vendor 
                      ? `Update the details for ${vendor.vendorName}`
                      : "Add a new vendor to your accounts payable system"
                    }
                  </DialogDescription>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div className="p-6 pt-0">
          <VendorForm
            defaultValues={vendor}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Footer Status */}
        <div className="border-t border-slate-200/60 px-6 py-3 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500"></span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {vendor ? "Editing existing vendor" : "Creating new vendor"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {vendor ? `ID: ${vendor.id.slice(0, 8)}` : "New vendor"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}