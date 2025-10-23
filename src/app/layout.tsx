import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpenseTracker - Manage Your Finances",
  description: "A smart expense tracker to manage your personal finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              className: 'z-[100]',
              style: {
                background: 'white',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '0.5rem',
                padding: '12px 16px',
                fontSize: '0.9375rem',
                fontWeight: 500,
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
