import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toby Reminder",
  description: "Apple Reminders 스타일 웹 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
