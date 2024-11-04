import type { Metadata } from "next";
import "./globals.css";
import React from "react";
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
        "scroll-smooth antialiased md:text-base",
      )}
    >
      <body className="flex min-h-screen flex-col px-6">
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
