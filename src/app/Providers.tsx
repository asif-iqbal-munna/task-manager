"use client";

import React, { useState } from "react";
import { Provider } from "../components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Toaster />
        {children}
      </Provider>
    </QueryClientProvider>
  );
};

export default Providers;
