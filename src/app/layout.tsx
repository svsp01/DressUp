import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DresssUp - AI-Powered Dress Try-On Application",
  description: "DresssUp is an AI-powered application that allows you to try on dresses virtually using AI technology. Features include text-to-image transformations and advanced image classification models to help you find the perfect outfit.",
  keywords: "AI dress try-on, virtual fitting, text-to-image, image classification, fashion technology, virtual try-on",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
    </html>
  );
}
