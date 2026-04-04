"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="top-right" richColors />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
