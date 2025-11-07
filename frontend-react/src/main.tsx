import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AppProvider } from "./components/context/AppContext";
import { router } from "./router/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/react-query/query-client";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AppProvider>,
);
