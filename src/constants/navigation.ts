import {
  LayoutDashboard,
  Upload,
  FileText,
  Building2,
  BarChart3,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Invoice Upload",
    href: "/invoices/upload",
    icon: Upload,
  },
  {
    label: "Invoices",
    href: "/invoices/list",
    icon: FileText,
  },
  {
    label: "Vendors",
    href: "/vendors",
    icon: Building2,
  },
  {
    label: "Vendor Dashboard",
    href: "/vendor-dashboard",
    icon: BarChart3,
  },
];