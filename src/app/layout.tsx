import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VS Code Web Clone",
  description: "A VS Code clone built with Next.js and modern web technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1e1e1e] text-white`}>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
} 