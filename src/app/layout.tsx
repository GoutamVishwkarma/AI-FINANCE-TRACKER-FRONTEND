import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinancePath - Manage Your Finances",
  description: "A smart finance management tool to track your expenses and income",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
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
