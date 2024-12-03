import type { Metadata } from "next";
import "./globals.css";
import React, { Suspense } from "react";
import Footer from "@/components/footer";
import { Inter, Inter_Tight } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Purple Squirrel",
  description: "Applicant Search Engine",
};

const fontText = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontDisplay = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        fontText.variable,
        fontDisplay.variable,
        "scroll-smooth antialiased",
      )}
    >
      <body className="px-6 pb-40 pt-8">
        <Suspense>{children}</Suspense>
        <Footer />
      </body>
    </html>
  );
}
