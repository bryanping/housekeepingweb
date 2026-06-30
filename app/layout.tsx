import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HousekeepingWeb",
  description: "配對顧著與家政人員，減少訊息差、取代傳統家政公司，雇主發包（家裡大小“台坪”、房數、客廳、廚房、廁所數量）特定要求、基礎要求，家政老師註冊、接單、勾選todo list(這部分還需要生成細節內容)，價",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className={inter.className}>
        <div className="bg-white min-h-screen">{children}</div>
      </body>
    </html>
  );
}