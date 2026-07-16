import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router"
import { QueryProvider } from "./app/providers/query-provider";
import { ThemeProvider } from "./app/providers/theme-provider";
import { Toaster } from "./components/ui/sonner";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  </ThemeProvider>
);