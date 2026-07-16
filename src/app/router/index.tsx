import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import DashboardPage from "@/pages/dashboard";
import InvoiceUploadPage from "@/pages/invoices/upload";
import InvoiceListPage from "@/pages/invoices";
import VendorPage from "@/pages/vendors/VendorsPage";
import VendorDashboardPage from "@/pages/vendors/VendorDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "invoices",
        element: <InvoiceListPage />,
      },
      {
        path: "invoices/list",
        element: <InvoiceListPage />,
      },
      {
        path: "invoices/upload",
        element: <InvoiceUploadPage />,
      },
      {
        path: "vendors",
        element: <VendorPage />,
      },
      {
        path: "vendor-dashboard",
        element: <VendorDashboardPage />,
      },
    ],
  },
]);