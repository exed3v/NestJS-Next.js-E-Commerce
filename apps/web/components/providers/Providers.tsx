"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
