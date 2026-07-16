import { useForm } from "react-hook-form";
import type { Vendor } from "@/types/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Hash, 
  FileText, 
  CreditCard, 
  Mail, 
  Phone, 
  Globe,
  Save,
  X,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

type Props = {
  defaultValues?: Partial<Vendor>;
  onSubmit: (data: Partial<Vendor>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

export default function VendorForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid },
    watch 
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const formValues = watch();

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const getFieldError = (fieldName: keyof Vendor) => {
    return touched[fieldName] && errors[fieldName]?.message;
  };

  const inputClassName = (fieldName: keyof Vendor) => `
    w-full rounded-xl border-2 bg-white/50 px-4 py-2.5 text-sm text-slate-700 
    placeholder:text-slate-400 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-400/20
    dark:bg-slate-900/50 dark:text-slate-200 dark:placeholder:text-slate-500
    ${errors[fieldName] && touched[fieldName] 
      ? 'border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-500' 
      : 'border-slate-200/60 hover:border-slate-300 focus:border-blue-400 dark:border-slate-700/60 dark:hover:border-slate-600 dark:focus:border-blue-500'
    }
  `;

  const labelClassName = "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5";

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-5"
    >
      {/* Vendor Name */}
      <div>
        <label className={labelClassName}>
          <Building2 className="inline h-3.5 w-3.5 mr-1.5" />
          Vendor Name <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter vendor name"
          {...register("vendorName", { 
            required: "Vendor name is required",
            minLength: { value: 2, message: "Name must be at least 2 characters" }
          })}
          onBlur={() => handleFieldBlur("vendorName")}
          className={inputClassName("vendorName")}
        />
        {getFieldError("vendorName") && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.vendorName?.message as string}
          </p>
        )}
      </div>

      {/* Vendor Code */}
      <div>
        <label className={labelClassName}>
          <Hash className="inline h-3.5 w-3.5 mr-1.5" />
          Vendor Code <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter vendor code"
          {...register("vendorCode", { 
            required: "Vendor code is required",
            minLength: { value: 2, message: "Code must be at least 2 characters" }
          })}
          onBlur={() => handleFieldBlur("vendorCode")}
          className={inputClassName("vendorCode")}
        />
        {getFieldError("vendorCode") && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.vendorCode?.message as string}
          </p>
        )}
      </div>

      {/* GST Number */}
      <div>
        <label className={labelClassName}>
          <FileText className="inline h-3.5 w-3.5 mr-1.5" />
          GST Number <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Enter GST number"
          {...register("gstNumber", { 
            required: "GST number is required",
            pattern: {
              value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
              message: "Invalid GST number format"
            }
          })}
          onBlur={() => handleFieldBlur("gstNumber")}
          className={inputClassName("gstNumber")}
        />
        {getFieldError("gstNumber") && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.gstNumber?.message as string}
          </p>
        )}
      </div>

      {/* PAN Number */}
      <div>
        <label className={labelClassName}>
          <CreditCard className="inline h-3.5 w-3.5 mr-1.5" />
          PAN Number
        </label>
        <Input
          placeholder="Enter PAN number"
          {...register("panNumber", {
            pattern: {
              value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              message: "Invalid PAN number format"
            }
          })}
          onBlur={() => handleFieldBlur("panNumber")}
          className={inputClassName("panNumber")}
        />
        {getFieldError("panNumber") && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.panNumber?.message as string}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelClassName}>
          <Mail className="inline h-3.5 w-3.5 mr-1.5" />
          Email Address
        </label>
        <Input
          type="email"
          placeholder="Enter email address"
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address"
            }
          })}
          onBlur={() => handleFieldBlur("email")}
          className={inputClassName("email")}
        />
        {getFieldError("email") && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.email?.message as string}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClassName}>
          <Phone className="inline h-3.5 w-3.5 mr-1.5" />
          Phone Number
        </label>
        <Input
          type="tel"
          placeholder="Enter phone number"
          {...register("phone", {
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone number (10 digits required)"
            }
          })}
          onBlur={() => handleFieldBlur("phone")}
          className={inputClassName("phone")}
        />
        {getFieldError("phone") && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.phone?.message as string}
          </p>
        )}
      </div>

      {/* Country */}
      <div>
        <label className={labelClassName}>
          <Globe className="inline h-3.5 w-3.5 mr-1.5" />
          Country
        </label>
        <Input
          placeholder="Enter country"
          {...register("country")}
          onBlur={() => handleFieldBlur("country")}
          className={inputClassName("country")}
        />
      </div>

      {/* Form Actions */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button 
          type="submit" 
          className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-105 disabled:opacity-50 disabled:shadow-none"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Vendor
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            className="flex-1 gap-2 border-slate-200/60 hover:bg-slate-100/80 dark:border-slate-700/60 dark:hover:bg-slate-800/60"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>

      {/* Form Stats */}
      {Object.keys(formValues).length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {Object.keys(formValues).filter(key => formValues[key as keyof Vendor]).length} fields filled
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {isValid ? '✅ Ready to save' : '⚠️ Please fill required fields'}
          </p>
        </div>
      )}
    </form>
  );
}