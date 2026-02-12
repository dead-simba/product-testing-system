import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutContent } from "@/components/LayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Testing Management System",
  description: "Admin panel for managing product testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-gray-50 text-slate-900">
          <LayoutContent>{children}</LayoutContent>
        </div>
      </body>
    </html>
  );
}
