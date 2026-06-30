import type { Metadata } from “next”;
import { Inter } from “next/font/google”;
import “./globals.css”;
import Navbar from “@/components/Navbar”;

const inter = Inter({ subsets: [“latin”] });

export const metadata: Metadata = {
  title: “HousekeepingWeb — 家政配對平台”,
  description: “配對雇主與家政人員，減少訊息差，取代傳統家政公司”,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang=”zh-Hant”>
      <body className={inter.className}>
        <Navbar />
        <div className=”bg-white min-h-screen”>{children}</div>
      </body>
    </html>
  );
}