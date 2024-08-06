import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Purple Squirrel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className="dark">
        <body>
          <Providers>
            <main>{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
