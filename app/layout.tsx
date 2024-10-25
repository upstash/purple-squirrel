import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Purple Squirrel",
  description: "Applicant Search Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
